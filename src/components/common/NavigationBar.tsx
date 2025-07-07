import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { FiChevronLeft, FiUser, FiSend } from 'react-icons/fi';

const NavigationBar = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogin = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/profilepage');
    } else {
      navigate('/login');
    }
  };

  const handleDM = () => {
    navigate('/dm');
  };

  const handleTitleClick = () => {
    navigate('/'); // ✅ 제목 클릭 시 홈으로 이동
  };

  return (
    <NavBar>
      <Left>
        <IconButton onClick={handleBack}>
          <FiChevronLeft size={24} color={theme.textColors.default} />
        </IconButton>
      </Left>

      <Center>
        <Title onClick={handleTitleClick}>감정분석(제목)</Title>
      </Center>

      <Right>
        <IconButton onClick={handleLogin}>
          <FiUser size={24} color={theme.textColors.default} />
        </IconButton>
        <IconButton
          onClick={handleDM}
          style={{ marginLeft: theme.spacing.spacing2 }}
        >
          <FiSend size={22} color={theme.textColors.default} />
        </IconButton>
      </Right>
    </NavBar>
  );
};

export default NavigationBar;

// -------------------- 스타일 --------------------

const NavBar = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.colors.gray00};
  border-bottom: 1px solid ${({ theme }) => theme.borderColors.default};
  height: 56px;
`;

const Left = styled.div`
  position: absolute;
  left: 16px;
  display: flex;
  align-items: center;
`;

const Center = styled.div`
  font: ${({ theme }) => theme.typography.title2Bold};
  color: ${({ theme }) => theme.textColors.default};
`;

const Right = styled.div`
  position: absolute;
  right: 16px;
  display: flex;
  align-items: center;
`;

const Title = styled.span`
  font: ${({ theme }) => theme.typography.title2Bold};
  color: ${({ theme }) => theme.textColors.default};
  cursor: pointer; //
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
`;
