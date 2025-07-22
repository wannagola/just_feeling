import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserStore } from '@/stores/useUserStore';
import { ApiService } from '@/services/api';

// 감정 옵션 정의 (CreatePostPage와 동일)
const EMOTION_OPTIONS = [
  { emoji: '😊', text: '기쁨', value: '😊 기쁨' },
  { emoji: '😢', text: '슬픔', value: '😢 슬픔' },
  { emoji: '😡', text: '분노', value: '😡 분노' },
  { emoji: '🥶', text: '무서움', value: '🥶 Fear' },
  { emoji: '😌', text: '평온', value: '😌 평온' },
  { emoji: '😴', text: '피곤', value: '😴 피곤' },
  { emoji: '🤗', text: '감동', value: '🤗 감동' },
  { emoji: '😔', text: '우울', value: '😔 우울' },
  { emoji: '😤', text: '답답', value: '😤 답답' },
  { emoji: '🥳', text: '신남', value: '🥳 신남' },
];

interface Post {
  id: number;
  userId: string;
  emotion: string;
  contentText: string;
  contentImage: string;
  createdAt: string;
}

const EditPostPage = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const { user } = useUserStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [contentText, setContentText] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 게시글 데이터 로드
  useEffect(() => {
    const loadPost = async () => {
      if (!postId) {
        alert('잘못된 접근입니다.');
        navigate('/');
        return;
      }

      try {
        // 모든 게시글을 가져와서 해당 ID 찾기 (현재 개별 게시글 조회 API가 없으므로)
        const posts = await ApiService.getAllPosts();
        const targetPost = posts.find((p: Post) => p.id === parseInt(postId));
        
        if (!targetPost) {
          alert('게시글을 찾을 수 없습니다.');
          navigate('/');
          return;
        }

        // 작성자 확인
        if (user && targetPost.userId !== user.userName) {
          alert('수정 권한이 없습니다.');
          navigate('/');
          return;
        }

        setPost(targetPost);
        setSelectedEmotion(targetPost.emotion);
        setContentText(targetPost.contentText);
        if (targetPost.contentImage) {
          setImagePreview(targetPost.contentImage);
        }
      } catch (error) {
        console.error('게시글 로드 실패:', error);
        alert('게시글을 불러오는 중 오류가 발생했습니다.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId, user, navigate]);

  // 이미지 파일 선택 처리
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      
      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 제거
  const handleImageRemove = () => {
    setSelectedImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 게시글 수정 제출
  const handleSubmit = async () => {
    if (!user || !post) {
      alert('잘못된 접근입니다.');
      navigate('/');
      return;
    }

    if (!selectedEmotion) {
      alert('감정을 선택해주세요.');
      return;
    }

    if (!contentText.trim()) {
      alert('게시글 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 이미지 처리 (현재는 간단히 base64로 처리)
      let imageData = '';
      if (selectedImage) {
        imageData = imagePreview;
      } else if (imagePreview && !selectedImage) {
        // 기존 이미지 유지
        imageData = imagePreview;
      }

      const response = await ApiService.updatePost(
        post.id,
        selectedEmotion,
        contentText.trim(),
        imageData
      );

      if (response.success) {
        alert('게시글이 성공적으로 수정되었습니다!');
        navigate('/');
      } else {
        alert(response.message || '게시글 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      alert('게시글 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 수정 취소
  const handleCancel = () => {
    if (!post) return;
    
    const hasChanges = 
      selectedEmotion !== post.emotion || 
      contentText !== post.contentText ||
      selectedImage ||
      (imagePreview !== (post.contentImage || ''));
      
    if (hasChanges) {
      if (confirm('수정 중인 내용이 삭제됩니다. 정말 취소하시겠습니까?')) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>게시글을 불러오는 중...</LoadingMessage>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container>
        <ErrorMessage>게시글을 찾을 수 없습니다.</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <CancelButton onClick={handleCancel}>취소</CancelButton>
        <Title>게시글 수정</Title>
        <SubmitButton 
          onClick={handleSubmit}
          disabled={!selectedEmotion || !contentText.trim() || isSubmitting}
        >
          {isSubmitting ? '수정 중...' : '수정하기'}
        </SubmitButton>
      </Header>

      <Content>
        {/* 감정 선택 섹션 */}
        <Section>
          <SectionTitle>감정을 선택해주세요</SectionTitle>
          <EmotionGrid>
            {EMOTION_OPTIONS.map((emotion) => (
              <EmotionOption
                key={emotion.value}
                selected={selectedEmotion === emotion.value}
                onClick={() => setSelectedEmotion(emotion.value)}
              >
                <EmotionEmoji>{emotion.emoji}</EmotionEmoji>
                <EmotionText>{emotion.text}</EmotionText>
              </EmotionOption>
            ))}
          </EmotionGrid>
        </Section>

        {/* 내용 입력 섹션 */}
        <Section>
          <SectionTitle>내용 수정</SectionTitle>
          <TextArea
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
            placeholder="게시글 내용을 입력해주세요..."
            maxLength={1000}
          />
          <CharCount>{contentText.length}/1000</CharCount>
        </Section>

        {/* 이미지 업로드 섹션 */}
        <Section>
          <SectionTitle>사진 수정 (선택사항)</SectionTitle>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />
          
          {imagePreview ? (
            <ImagePreviewContainer>
              <ImagePreview src={imagePreview} alt="업로드된 이미지" />
              <ImageButtonContainer>
                <ChangeImageButton onClick={() => fileInputRef.current?.click()}>
                  🔄 이미지 변경
                </ChangeImageButton>
                <RemoveImageButton onClick={handleImageRemove}>
                  ✕ 이미지 제거
                </RemoveImageButton>
              </ImageButtonContainer>
            </ImagePreviewContainer>
          ) : (
            <ImageUploadButton onClick={() => fileInputRef.current?.click()}>
              📷 사진 추가하기
            </ImageUploadButton>
          )}
        </Section>

        {/* 미리보기 섹션 */}
        {(selectedEmotion || contentText) && (
          <Section>
            <SectionTitle>미리보기</SectionTitle>
            <PreviewCard>
              <PreviewHeader>
                <PreviewUser>{post.userId}</PreviewUser>
                <PreviewEmotion>{selectedEmotion}</PreviewEmotion>
              </PreviewHeader>
              <PreviewContent>{contentText}</PreviewContent>
              {imagePreview && <PreviewImage src={imagePreview} alt="미리보기" />}
            </PreviewCard>
          </Section>
        )}
      </Content>
    </Container>
  );
};

export default EditPostPage;

// 스타일 컴포넌트들 (CreatePostPage와 동일한 구조)
const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.backgroundColors.fill};
`;

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font: ${({ theme }) => theme.typography.body1Regular};
  color: ${({ theme }) => theme.textColors.sub};
`;

const ErrorMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font: ${({ theme }) => theme.typography.body1Regular};
  color: ${({ theme }) => theme.stateColors.critical};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.spacing4};
  background-color: ${({ theme }) => theme.colors.gray00};
  border-bottom: 1px solid ${({ theme }) => theme.borderColors.default};
`;

const CancelButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textColors.sub};
  font: ${({ theme }) => theme.typography.body2Regular};
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.textColors.default};
  }
`;

const Title = styled.h1`
  font: ${({ theme }) => theme.typography.title1Bold};
  color: ${({ theme }) => theme.textColors.default};
`;

const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.colors.blue600};
  color: ${({ theme }) => theme.colors.gray00};
  border: none;
  border-radius: 8px;
  padding: ${({ theme }) => `${theme.spacing.spacing2} ${theme.spacing.spacing4}`};
  font: ${({ theme }) => theme.typography.body2Bold};
  cursor: pointer;
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray300};
    cursor: not-allowed;
  }
  
  &:not(:disabled):hover {
    background-color: ${({ theme }) => theme.colors.blue700};
  }
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing.spacing4};
  max-width: 600px;
  margin: 0 auto;
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.spacing8};
`;

const SectionTitle = styled.h2`
  font: ${({ theme }) => theme.typography.title2Bold};
  color: ${({ theme }) => theme.textColors.default};
  margin-bottom: ${({ theme }) => theme.spacing.spacing4};
`;

const EmotionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: ${({ theme }) => theme.spacing.spacing3};
`;

const EmotionOption = styled.div<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.spacing4};
  border: 2px solid ${({ theme, selected }) => 
    selected ? theme.colors.blue600 : theme.borderColors.default};
  border-radius: 12px;
  background-color: ${({ theme, selected }) => 
    selected ? theme.colors.blue100 : theme.colors.gray00};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.blue600};
    transform: translateY(-2px);
  }
`;

const EmotionEmoji = styled.div`
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.spacing.spacing2};
`;

const EmotionText = styled.div`
  font: ${({ theme }) => theme.typography.body2Bold};
  color: ${({ theme }) => theme.textColors.default};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: ${({ theme }) => theme.spacing.spacing4};
  border: 1px solid ${({ theme }) => theme.borderColors.default};
  border-radius: 8px;
  font: ${({ theme }) => theme.typography.body2Regular};
  color: ${({ theme }) => theme.textColors.default};
  background-color: ${({ theme }) => theme.colors.gray00};
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.blue600};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.textColors.placeholder};
  }
`;

const CharCount = styled.div`
  text-align: right;
  font: ${({ theme }) => theme.typography.label2Regular};
  color: ${({ theme }) => theme.textColors.sub};
  margin-top: ${({ theme }) => theme.spacing.spacing2};
`;

const ImageUploadButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.spacing6};
  border: 2px dashed ${({ theme }) => theme.borderColors.default};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.gray00};
  color: ${({ theme }) => theme.textColors.sub};
  font: ${({ theme }) => theme.typography.body2Regular};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.blue600};
    color: ${({ theme }) => theme.colors.blue600};
  }
`;

const ImagePreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.spacing3};
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.colors.gray200} 0px 2px 8px;
`;

const ImageButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.spacing3};
`;

const ChangeImageButton = styled.button`
  background-color: ${({ theme }) => theme.colors.blue600};
  color: ${({ theme }) => theme.colors.gray00};
  border: none;
  border-radius: 4px;
  padding: ${({ theme }) => `${theme.spacing.spacing2} ${theme.spacing.spacing4}`};
  font: ${({ theme }) => theme.typography.label2Bold};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.blue700};
  }
`;

const RemoveImageButton = styled.button`
  background-color: ${({ theme }) => theme.stateColors.critical};
  color: ${({ theme }) => theme.colors.gray00};
  border: none;
  border-radius: 4px;
  padding: ${({ theme }) => `${theme.spacing.spacing2} ${theme.spacing.spacing4}`};
  font: ${({ theme }) => theme.typography.label2Bold};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.red700};
  }
`;

const PreviewCard = styled.div`
  background-color: ${({ theme }) => theme.colors.gray00};
  border: 1px solid ${({ theme }) => theme.borderColors.default};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.spacing4};
`;

const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.spacing3};
`;

const PreviewUser = styled.div`
  font: ${({ theme }) => theme.typography.body2Bold};
  color: ${({ theme }) => theme.textColors.default};
`;

const PreviewEmotion = styled.div`
  font: ${({ theme }) => theme.typography.body2Regular};
  color: ${({ theme }) => theme.colors.blue600};
`;

const PreviewContent = styled.div`
  font: ${({ theme }) => theme.typography.body2Regular};
  color: ${({ theme }) => theme.textColors.default};
  margin-bottom: ${({ theme }) => theme.spacing.spacing3};
  white-space: pre-wrap;
`;

const PreviewImage = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
`; 