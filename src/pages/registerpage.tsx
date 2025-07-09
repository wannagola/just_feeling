import styled from '@emotion/styled';
import { useNavigate, Link } from 'react-router-dom';
import RegisterFormSection from '@/components/common/RegisterFormSection';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    navigate('/login', { replace: true });
  };

  return (
    <Container>
      <Logo>Just Feeling</Logo>
      <Title>회원가입</Title>
      <RegisterFormSection onRegisterSuccess={handleRegisterSuccess} />
      <LinkContainer>
        <StyledLink to="/login">이미 계정이 있으신가요? 로그인하기</StyledLink>
      </LinkContainer>
    </Container>
  );
};

export default RegisterPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.spacing8} ${({ theme }) => theme.spacing.spacing5} 0;
  background-color: ${({ theme }) => theme.backgroundColors.default};
  max-width: 720px;
  margin: 0 auto;
  min-height: 100vh;
`;

const Logo = styled.h1`
  font: ${({ theme }) => theme.typography.title1Bold};
  color: ${({ theme }) => theme.textColors.default};
  margin-bottom: ${({ theme }) => theme.spacing.spacing4};
`;

const Title = styled.h2`
  font: ${({ theme }) => theme.typography.title2Bold};
  color: ${({ theme }) => theme.textColors.default};
  margin-bottom: ${({ theme }) => theme.spacing.spacing8};
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