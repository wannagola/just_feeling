/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { useRegisterForm } from '@/hooks/useRegisterForm';
import { theme } from '@/constants/theme';

type Props = {
  onRegisterSuccess: () => void;
};

const RegisterFormSection = ({ onRegisterSuccess }: Props) => {
  const {
    userName,
    email,
    password,
    confirmPassword,
    setUserName,
    setEmail,
    setPassword,
    setConfirmPassword,
    //userNameTouched,
    //emailTouched,
    //passwordTouched,
    //confirmPasswordTouched,
    setUserNameTouched,
    setEmailTouched,
    setPasswordTouched,
    setConfirmPasswordTouched,
    userNameError,
    emailError,
    passwordError,
    confirmPasswordError,
    isFormValid,
  } = useRegisterForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      try {
        const { ApiService } = await import('@/services/api');
        const response = await ApiService.register(userName, email, password);
        
        if (response.success) {
          alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
          onRegisterSuccess();
        }
      } catch (error: any) {
        console.error('회원가입 실패:', error);
        const errorMessage = error.message || '회원가입에 실패했습니다. 다시 시도해주세요.';
        alert(errorMessage);
      }
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <InputGroup>
        <Label htmlFor="userName">사용자명</Label>
        <Input
          id="userName"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onBlur={() => setUserNameTouched(true)}
          aria-describedby="userName-error"
          placeholder="영문, 숫자, 언더스코어 사용 가능"
        />
        {userNameError && <ErrorText id="userName-error">{userNameError}</ErrorText>}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setEmailTouched(true)}
          aria-describedby="email-error"
          placeholder="example@email.com"
        />
        {emailError && <ErrorText id="email-error">{emailError}</ErrorText>}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setPasswordTouched(true)}
          aria-describedby="password-error"
          placeholder="영문, 숫자 포함 8자 이상"
        />
        {passwordError && <ErrorText id="password-error">{passwordError}</ErrorText>}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => setConfirmPasswordTouched(true)}
          aria-describedby="confirmPassword-error"
          placeholder="비밀번호를 다시 입력해주세요"
        />
        {confirmPasswordError && <ErrorText id="confirmPassword-error">{confirmPasswordError}</ErrorText>}
      </InputGroup>

      <RegisterButton type="submit" disabled={!isFormValid}>
        회원가입
      </RegisterButton>
    </FormWrapper>
  );
};

export default RegisterFormSection;

// ---------------- styled components ----------------

const FormWrapper = styled.form`
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  margin-bottom: ${theme.spacing.spacing6};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${theme.spacing.spacing2};
  font: ${theme.typography.body2Bold};
  color: ${theme.textColors.default};
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 ${theme.spacing.spacing3};
  border: 1px solid ${theme.borderColors.default};
  border-radius: 8px;
  font: ${theme.typography.body2Regular};
  background-color: ${theme.backgroundColors.fill};
  color: ${theme.textColors.default};

  &::placeholder {
    color: ${theme.textColors.placeholder};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.blue600};
    background-color: ${theme.backgroundColors.default};
  }
`;

const ErrorText = styled.p`
  margin-top: ${theme.spacing.spacing1};
  font: ${theme.typography.label2Regular};
  color: ${theme.stateColors.critical};
`;

const RegisterButton = styled.button<{ disabled: boolean }>`
  height: 48px;
  border: none;
  border-radius: 8px;
  font: ${theme.typography.body2Bold};
  background-color: ${({ disabled }) =>
    disabled ? theme.colors.gray300 : theme.colors.blue600};
  color: ${theme.colors.gray00};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  margin-top: ${theme.spacing.spacing2};

  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? theme.colors.gray300 : theme.colors.blue700};
    color: ${theme.colors.gray00};
  }

  &:active {
    background-color: ${({ disabled }) =>
      disabled ? theme.colors.gray300 : theme.colors.blue800};
    color: ${theme.colors.gray00};
  }
`; 