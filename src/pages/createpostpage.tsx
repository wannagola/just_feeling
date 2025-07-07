import styled from '@emotion/styled';

const CreatePostPage = () => {
  return (
    <Wrapper>
      <h2>게시글 추가 페이지</h2>
      {/* 이후 폼 구현 예정 */}
    </Wrapper>
  );
};

export default CreatePostPage;

const Wrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.spacing4};
`;
