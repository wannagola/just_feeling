/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiMessageCircle, FiShare2, FiBookmark, FiEdit, FiTrash2, FiMoreHorizontal } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import { ApiService } from '@/services/api';

type PostItemProps = {
  postId: number;
  userId: string;
  emotion: string;
  contentText?: string;
  contentImage?: string | null;
  likeCount?: number;
  onPostDeleted?: () => void; // 게시글 삭제 후 콜백
};

const PostItem = ({ postId, userId, emotion, contentText, contentImage, likeCount = 0, onPostDeleted }: PostItemProps) => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const isOwner = user && user.userName === userId;

  // 컴포넌트 마운트 시 좋아요 정보 로드
  useEffect(() => {
    const loadLikeInfo = async () => {
      if (!user) return;
      
      try {
        const response = await ApiService.getLikeInfo(postId, user.userName);
        if (response.success) {
          setCurrentLikeCount(response.likeCount);
          setIsLiked(response.isLiked);
        }
      } catch (error) {
        console.error('좋아요 정보 로드 실패:', error);
      }
    };

    loadLikeInfo();
  }, [postId, user]);

  // 좋아요 토글
  const handleLikeToggle = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (isLikeLoading) return;

    setIsLikeLoading(true);
    try {
      const response = await ApiService.toggleLike(postId, user.userName);
      if (response.success) {
        setIsLiked(response.isLiked);
        setCurrentLikeCount(response.likeCount);
      } else {
        alert(response.message || '좋아요 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLikeLoading(false);
    }
  };

  // 게시글 수정
  const handleEdit = () => {
    navigate(`/edit-post/${postId}`);
  };

  // 게시글 삭제
  const handleDelete = async () => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await ApiService.deletePost(postId);
      if (response.success) {
        alert('게시글이 삭제되었습니다.');
        onPostDeleted?.(); // 상위 컴포넌트에 삭제 알림
      } else {
        alert(response.message || '게시글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      alert('게시글 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  return (
    <Card>
      <Header>
        <UserInfo>
          <UserId>{userId}</UserId>
          <EmotionTag>{emotion}</EmotionTag>
        </UserInfo>
        
        {isOwner && (
          <MenuContainer>
            <MenuButton 
              onClick={() => setShowMenu(!showMenu)}
              disabled={isDeleting}
            >
              <FiMoreHorizontal size={20} />
            </MenuButton>
            
            {showMenu && (
              <DropdownMenu>
                <MenuOption onClick={handleEdit}>
                  <FiEdit size={16} />
                  수정하기
                </MenuOption>
                <MenuOption 
                  onClick={handleDelete} 
                  danger
                  disabled={isDeleting}
                >
                  <FiTrash2 size={16} />
                  {isDeleting ? '삭제 중...' : '삭제하기'}
                </MenuOption>
              </DropdownMenu>
            )}
          </MenuContainer>
        )}
      </Header>

      <ContentArea>
        {contentText && <PostText>{contentText}</PostText>}
        {contentImage && <PostImage src={contentImage} alt="post" />}
      </ContentArea>

      <Actions>
        <LeftButtons>
          <LikeButton 
            onClick={handleLikeToggle} 
            isLiked={isLiked}
            disabled={isLikeLoading}
          >
            <FiHeart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            {currentLikeCount > 0 && <LikeCount>{currentLikeCount}</LikeCount>}
          </LikeButton>
          <ActionButton><FiMessageCircle size={20} /></ActionButton>
          <ActionButton><FiShare2 size={20} /></ActionButton>
        </LeftButtons>
        <RightButton>
          <ActionButton><FiBookmark size={20} /></ActionButton>
        </RightButton>
      </Actions>
    </Card>
  );
};

export default PostItem;

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.gray1000};
  color: ${({ theme }) => theme.colors.gray00};
  padding: ${({ theme }) => theme.spacing.spacing4};
  margin-bottom: ${({ theme }) => theme.spacing.spacing5};
  border-radius: 12px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.spacing3};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.spacing1};
`;

const UserId = styled.div`
  font: ${({ theme }) => theme.typography.body2Bold};
`;

const EmotionTag = styled.div`
  font: ${({ theme }) => theme.typography.label2Regular};
  color: ${({ theme }) => theme.stateColors.info};
`;

const MenuContainer = styled.div`
  position: relative;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.gray00};
  padding: ${({ theme }) => theme.spacing.spacing1};
  border-radius: 4px;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray800};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${({ theme }) => theme.colors.gray00};
  border: 1px solid ${({ theme }) => theme.borderColors.default};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  min-width: 120px;
  overflow: hidden;
`;

const MenuOption = styled.button<{ danger?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.spacing2};
  padding: ${({ theme }) => `${theme.spacing.spacing3} ${theme.spacing.spacing4}`};
  background: none;
  border: none;
  font: ${({ theme }) => theme.typography.body2Regular};
  color: ${({ theme, danger }) => 
    danger ? theme.stateColors.critical : theme.textColors.default};
  text-align: left;
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme, danger }) => 
      danger ? theme.stateColors.criticalBackground : theme.backgroundColors.fill};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ContentArea = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.spacing3};
`;

const PostText = styled.p`
  font: ${({ theme }) => theme.typography.body2Regular};
  margin-bottom: ${({ theme }) => theme.spacing.spacing2};
`;

const PostImage = styled.img`
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LeftButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.spacing3};
`;

const RightButton = styled.div``;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.gray00};
`;

const LikeButton = styled(ActionButton)<{ isLiked: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.spacing1};
  color: ${({ isLiked, theme }) => isLiked ? theme.stateColors.info : theme.textColors.default};
  font-weight: ${({ isLiked }) => isLiked ? 'bold' : 'normal'};

  &:hover {
    color: ${({ isLiked, theme }) => isLiked ? theme.stateColors.info : theme.textColors.default};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LikeCount = styled.span`
  font: ${({ theme }) => theme.typography.label2Regular};
  color: ${({ theme }) => theme.textColors.default};
`;
