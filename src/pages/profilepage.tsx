/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/useUserStore';

const ProfilePage = () => {
  const navigate = useNavigate();
  const logout = useUserStore((state) => state.logout);

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  return (
    <Container>
      <Title>내 프로필</Title>
      {/* 여기에 사용자 정보 보여주는 내용들 추가 가능 */}
      
      <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
    </Container>
  );
};

export default ProfilePage;

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.spacing5};
`;

const Title = styled.h2`
  font: ${({ theme }) => theme.typography.title2Regular};
  margin-bottom: ${({ theme }) => theme.spacing.spacing5};
`;

const LogoutButton = styled.button`
  background-color: ${({ theme }) => theme.stateColors.critical};
  color: white;
  padding: ${({ theme }) => theme.spacing.spacing3} ${({ theme }) => theme.spacing.spacing4};
  border: none;
  border-radius: 8px;
  font: ${({ theme }) => theme.typography.body2Bold};
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;
