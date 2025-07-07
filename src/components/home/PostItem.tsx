/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { FiHeart, FiMessageCircle, FiShare2, FiBookmark } from 'react-icons/fi';

type PostItemProps = {
  userId: string;
  emotion: string;
  contentText?: string;
  contentImage?: string | null;
};

const PostItem = ({ userId, emotion, contentText, contentImage }: PostItemProps) => {
  return (
    <Card>
      <Header>
        <UserId>{userId}</UserId>
        <EmotionTag>{emotion}</EmotionTag>
      </Header>

      <ContentArea>
        {contentText && <PostText>{contentText}</PostText>}
        {contentImage && <PostImage src={contentImage} alt="post" />}
      </ContentArea>

      <Actions>
        <LeftButtons>
          <ActionButton><FiHeart size={20} /></ActionButton>
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
  margin-bottom: ${({ theme }) => theme.spacing.spacing3};
`;

const UserId = styled.div`
  font: ${({ theme }) => theme.typography.body2Bold};
`;

const EmotionTag = styled.div`
  font: ${({ theme }) => theme.typography.label2Regular};
  color: ${({ theme }) => theme.stateColors.info};
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
