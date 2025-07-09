import { useState } from 'react';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const userNameRegex = /^[a-zA-Z0-9_]+$/;
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;

export const useRegisterForm = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userNameTouched, setUserNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  // 유효성 검사
  const isUserNameValid = userName.length >= 2 && userName.length <= 20 && userNameRegex.test(userName);
  const isEmailValid = email.length > 0 && emailRegex.test(email);
  const isPasswordValid = password.length >= 8 && password.length <= 100 && passwordRegex.test(password);
  const isConfirmPasswordValid = confirmPassword === password && password.length > 0;
  const isFormValid = isUserNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid;

  // 에러 메시지
  const userNameError =
    userNameTouched && userName.length === 0
      ? '사용자명을 입력해주세요.'
      : userNameTouched && userName.length < 2
      ? '사용자명은 2자 이상이어야 합니다.'
      : userNameTouched && userName.length > 20
      ? '사용자명은 20자 이하여야 합니다.'
      : userNameTouched && !userNameRegex.test(userName)
      ? '사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다.'
      : '';

  const emailError =
    emailTouched && email.length === 0
      ? '이메일을 입력해주세요.'
      : emailTouched && !emailRegex.test(email)
      ? '올바른 이메일 형식으로 입력해주세요.'
      : '';

  const passwordError =
    passwordTouched && password.length === 0
      ? '비밀번호를 입력해주세요.'
      : passwordTouched && password.length < 8
      ? '비밀번호는 8자 이상이어야 합니다.'
      : passwordTouched && password.length > 100
      ? '비밀번호는 100자 이하여야 합니다.'
      : passwordTouched && !passwordRegex.test(password)
      ? '비밀번호는 영문과 숫자를 포함해야 합니다.'
      : '';

  const confirmPasswordError =
    confirmPasswordTouched && confirmPassword.length === 0
      ? '비밀번호 확인을 입력해주세요.'
      : confirmPasswordTouched && confirmPassword !== password
      ? '비밀번호가 일치하지 않습니다.'
      : '';

  return {
    userName,
    email,
    password,
    confirmPassword,
    setUserName,
    setEmail,
    setPassword,
    setConfirmPassword,
    userNameTouched,
    emailTouched,
    passwordTouched,
    confirmPasswordTouched,
    setUserNameTouched,
    setEmailTouched,
    setPasswordTouched,
    setConfirmPasswordTouched,
    userNameError,
    emailError,
    passwordError,
    confirmPasswordError,
    isFormValid,
  };
}; 