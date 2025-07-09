/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/useUserStore';
import PostItem from '@/components/home/PostItem';

interface Post {
  postID: number;
  userId: string;
  emotion: string;
  contentText: string;
  contentImage?: string;
  createdAt: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useUserStore();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchUserPosts = async () => {
      if (!user) return;
      
      try {
        const { ApiService } = await import('@/services/api');
        const posts = await ApiService.getPostsByUser(user.userID.toString());
        setUserPosts(posts);
      } catch (error) {
        console.error('사용자 게시글 로딩 실패:', error);
        setUserPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user, isLoggedIn, navigate]);

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <Container>
      <ProfileHeader>
        <ProfileImage>
          {user.userName.charAt(0).toUpperCase()}
        </ProfileImage>
        <UserInfo>
          <UserName>{user.userName}</UserName>
          <UserEmail>{user.email}</UserEmail>
          <PostCount>게시글 {userPosts.length}개</PostCount>
        </UserInfo>
        <EditButton onClick={() => navigate('/edit-profile')}>
          프로필 편집
        </EditButton>
      </ProfileHeader>

      <Section>
        <SectionTitle>내 게시글</SectionTitle>
        {loading ? (
          <LoadingText>게시글을 불러오는 중...</LoadingText>
                 ) : userPosts.length > 0 ? (
           <PostList>
             {userPosts.map((post) => (
               <PostItem
                 key={post.postID}
                 userId={post.userId}
                 emotion={post.emotion}
                 contentText={post.contentText}
                 contentImage={post.contentImage} postId={0}               />
             ))}
           </PostList>
        ) : (
          <EmptyText>아직 작성한 게시글이 없습니다.</EmptyText>
        )}
      </Section>

      <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
    </Container>
  );
};

export default ProfilePage;

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.spacing5};
  max-width: 720px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.spacing6};
  background-color: ${({ theme }) => theme.backgroundColors.fill};
  border-radius: 12px;
  margin-bottom: ${({ theme }) => theme.spacing.spacing6};
`;

const ProfileImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.blue600};
  display: flex;
  align-items: center;
  justify-content: center;
  font: ${({ theme }) => theme.typography.title1Bold};
  color: white;
  margin-right: ${({ theme }) => theme.spacing.spacing4};
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  font: ${({ theme }) => theme.typography.title2Bold};
  color: ${({ theme }) => theme.textColors.default};
  margin-bottom: ${({ theme }) => theme.spacing.spacing1};
`;

const UserEmail = styled.p`
  font: ${({ theme }) => theme.typography.body2Regular};
  color: ${({ theme }) => theme.textColors.sub};
  margin-bottom: ${({ theme }) => theme.spacing.spacing2};
`;

const PostCount = styled.p`
  font: ${({ theme }) => theme.typography.label1Regular};
  color: ${({ theme }) => theme.textColors.disabled};
`;

const EditButton = styled.button`
  height: 36px;
  padding: 0 ${({ theme }) => theme.spacing.spacing3};
  border: 1px solid ${({ theme }) => theme.colors.blue600};
  border-radius: 8px;
  font: ${({ theme }) => theme.typography.label1Bold};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.blue600};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.blue600};
    color: white;
  }
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.spacing8};
`;

const SectionTitle = styled.h3`
  font: ${({ theme }) => theme.typography.title2Bold};
  color: ${({ theme }) => theme.textColors.default};
  margin-bottom: ${({ theme }) => theme.spacing.spacing4};
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.spacing3};
`;

const LoadingText = styled.p`
  text-align: center;
  font: ${({ theme }) => theme.typography.body2Regular};
  color: ${({ theme }) => theme.textColors.sub};
  padding: ${({ theme }) => theme.spacing.spacing6};
`;

const EmptyText = styled.p`
  text-align: center;
  font: ${({ theme }) => theme.typography.body2Regular};
  color: ${({ theme }) => theme.textColors.disabled};
  padding: ${({ theme }) => theme.spacing.spacing6};
`;

const LogoutButton = styled.button`
  background-color: ${({ theme }) => theme.stateColors.critical};
  color: white;
  padding: ${({ theme }) => theme.spacing.spacing3} ${({ theme }) => theme.spacing.spacing4};
  border: none;
  border-radius: 8px;
  font: ${({ theme }) => theme.typography.body2Bold};
  cursor: pointer;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.spacing4};

  &:hover {
    opacity: 0.9;
  }
`;
