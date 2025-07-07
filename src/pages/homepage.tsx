import styled from '@emotion/styled';
import PostItem from '@/components/home/PostItem';
import AddPostBanner from '@/components/home/AddPostBanner';

const posts = [
  {
    userId: 'seyopppii',
    emotion: '😊 기쁨',
    contentText: '오늘 드디어 꿈의 회사에 합격했어요! 🎉',
    contentImage: '/images/happy.jpeg',
  },
  {
    userId: 'siuuuuuuuu',
    emotion: '😢 슬픔',
    contentText: '오늘은 제가 좋아하는 축구선수가 하늘의 별이 된 날이에요. 너무 슬퍼요.',
    contentImage: '/images/sad-photo.png',
  },
  {
    userId: 'dobum_man',
    emotion: '🥶 Fear',
    contentText: '아 진짜 옷장위에 귀신.. 진짜 때리고 싶어.. 너무 무서웠어ㅠㅠ #무서운경험',
    contentImage: '/images/ghost.png',
  },
];

const HomePage = () => {
  return (
    <FeedWrapper>
      <AddPostBanner /> 
      {posts.map((post, index) => (
        <PostItem
          key={index}
          userId={post.userId}
          emotion={post.emotion}
          contentText={post.contentText}
          contentImage={post.contentImage}
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
