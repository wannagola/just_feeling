import styled from '@emotion/styled';
import PostItem from '@/components/home/PostItem';
import AddPostBanner from '@/components/home/AddPostBanner';
import { useState, useEffect } from 'react';
import { ApiService } from '@/services/api';

interface Post {
  id: number;
  userId: string;
  emotion: string;
  contentText: string;
  contentImage: string;
  likeCount: number;
  createdAt: string;
}

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await ApiService.getAllPosts();
      setPosts(response);
    } catch (error) {
      console.error('포스트 로딩 실패:', error);
      // 에러 발생 시 기본 데이터 사용
      setPosts([
        {
          id: 1,
          userId: 'seyopppii',
          emotion: '😊 기쁨',
          contentText: '오늘 드디어 꿈의 회사에 합격했어요! 🎉',
          contentImage: '/images/happy.jpeg',
          likeCount: 0,
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          userId: 'siuuuuuuuu',
          emotion: '😢 슬픔',
          contentText: '오늘은 제가 좋아하는 축구선수가 하늘의 별이 된 날이에요. 너무 슬퍼요.',
          contentImage: '/images/sad-photo.png',
          likeCount: 0,
          createdAt: new Date().toISOString(),
        },
        {
          id: 3,
          userId: 'dobum_man',
          emotion: '🥶 Fear',
          contentText: '아 진짜 옷장위에 귀신.. 진짜 때리고 싶어.. 너무 무서웠어ㅠㅠ #무서운경험',
          contentImage: '/images/ghost.png',
          likeCount: 0,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 게시글 삭제 후 목록 새로고침
  const handlePostDeleted = () => {
    fetchPosts();
  };

  if (loading) {
    return (
      <FeedWrapper>
        <div>로딩 중...</div>
      </FeedWrapper>
    );
  }

  return (
    <FeedWrapper>
      <AddPostBanner /> 
      {posts.map((post) => (
        <PostItem
          key={post.id}
          postId={post.id}
          userId={post.userId}
          emotion={post.emotion}
          contentText={post.contentText}
          contentImage={post.contentImage}
          likeCount={post.likeCount}
          onPostDeleted={handlePostDeleted}
        />
      ))}
    </FeedWrapper>
  );
};

export default HomePage;

const FeedWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.spacing4};
  background-color: ${({ theme }) => theme.colors.gray400};
  min-height: 100vh;
`;
