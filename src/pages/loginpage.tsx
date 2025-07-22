import styled from '@emotion/styled';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import LoginFormSection from '@/components/common/LoginFormSection';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  const handleLogin = () => {
    navigate(from, { replace: true });
  };

  return (
    <Container>
      <Logo>Just Feeling</Logo>
      <LoginFormSection onLoginSuccess={handleLogin} />
      <LinkContainer>
        <StyledLink to="/register">계정이 없으신가요? 회원가입하기</StyledLink>
      </LinkContainer>
    </Container>
  );
};

export default LoginPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.spacing12} ${({ theme }) => theme.spacing.spacing5} 0;
  background-color: ${({ theme }) => theme.backgroundColors.default};
  max-width: 720px;
  margin: 0 auto;
  min-height: 100vh;
`;

const Logo = styled.h1`
  font: ${({ theme }) => theme.typography.title1Bold};
  color: ${({ theme }) => theme.textColors.default};
  margin-bottom: ${({ theme }) => theme.spacing.spacing12};
`;

const LinkContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.spacing6};
  text-align: center;
`;

const StyledLink = styled(Link)`
  font: ${({ theme }) => theme.typography.body2Regular};
  color: ${({ theme }) => theme.colors.blue600};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.blue700};
    text-decoration: underline;
  }
`;
