import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const AddPostBanner = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/create');
  };

  return (
    <BannerCard onClick={handleClick}>
      <span>✏️ 오늘의 감정을 기록해보세요</span>
    </BannerCard>
  );
};

export default AddPostBanner;

const BannerCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.gray1000};
  color: white;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.spacing3};
  margin-bottom: ${({ theme }) => theme.spacing.spacing4};
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray1000};
  }
`;
