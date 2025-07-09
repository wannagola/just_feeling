import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/useUserStore';

const EditUserPage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, login } = useUserStore();
  
  // 프로필 편집 상태
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  
  // 비밀번호 변경 상태
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate('/login');
      return;
    }
    
    setUserName(user.userName);
    setEmail(user.email);
  }, [user, isLoggedIn, navigate]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setProfileLoading(true);
    try {
      const { ApiService } = await import('@/services/api');
      const response = await ApiService.updateProfile(user.userID, userName, email);
      
      if (response.success) {
        // 스토어의 사용자 정보 업데이트
        const token = localStorage.getItem('token');
        if (token) {
          login(response.user, token);
        }
        alert('프로필이 성공적으로 업데이트되었습니다.');
      }
    } catch (error: any) {
      console.error('프로필 업데이트 실패:', error);
      alert(error.message || '프로필 업데이트에 실패했습니다.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (newPassword !== confirmPassword) {
      alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    
    if (newPassword.length < 8) {
      alert('새 비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(newPassword)) {
      alert('새 비밀번호는 영문과 숫자를 포함해야 합니다.');
      return;
    }
    
    setPasswordLoading(true);
    try {
      const { ApiService } = await import('@/services/api');
      const response = await ApiService.changePassword(user.userID, currentPassword, newPassword);
      
      if (response.success) {
        alert('비밀번호가 성공적으로 변경되었습니다.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      console.error('비밀번호 변경 실패:', error);
      alert(error.message || '비밀번호 변경에 실패했습니다.');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/profilepage')}>← 프로필로 돌아가기</BackButton>
        <Title>계정 설정</Title>
      </Header>

      {/* 프로필 정보 수정 섹션 */}
      <Section>
        <SectionTitle>프로필 정보</SectionTitle>
        <Form onSubmit={handleProfileUpdate}>
          <InputGroup>
            <Label htmlFor="userName">사용자명</Label>
            <Input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="사용자명을 입력하세요"
              minLength={2}
              maxLength={20}
              pattern="^[a-zA-Z0-9_]+$"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              required
            />
          </InputGroup>

          <SubmitButton type="submit" disabled={profileLoading}>
            {profileLoading ? '업데이트 중...' : '프로필 업데이트'}
          </SubmitButton>
        </Form>
      </Section>

      {/* 비밀번호 변경 섹션 */}
      <Section>
        <SectionTitle>비밀번호 변경</SectionTitle>
        <Form onSubmit={handlePasswordChange}>
          <InputGroup>
            <Label htmlFor="currentPassword">현재 비밀번호</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="현재 비밀번호를 입력하세요"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="newPassword">새 비밀번호</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새 비밀번호를 입력하세요 (영문, 숫자 포함 8자 이상)"
              minLength={8}
              maxLength={100}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="새 비밀번호를 다시 입력하세요"
              required
            />
          </InputGroup>

          <SubmitButton type="submit" disabled={passwordLoading}>
            {passwordLoading ? '변경 중...' : '비밀번호 변경'}
          </SubmitButton>
        </Form>
      </Section>
    </Container>
  );
};

export default EditUserPage;

const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.spacing5};
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.spacing6};
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font: ${({ theme }) => theme.typography.body2Regular};
  color: ${({ theme }) => theme.colors.blue600};
  cursor: pointer;
  margin-bottom: ${({ theme }) => theme.spacing.spacing3};
  
  &:hover {
    color: ${({ theme }) => theme.colors.blue700};
  }
`;

const Title = styled.h1`
  font: ${({ theme }) => theme.typography.title1Bold};
  color: ${({ theme }) => theme.textColors.default};
`;

const Section = styled.div`
  background-color: ${({ theme }) => theme.backgroundColors.fill};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.spacing6};
  margin-bottom: ${({ theme }) => theme.spacing.spacing6};
`;

const SectionTitle = styled.h2`
  font: ${({ theme }) => theme.typography.title2Bold};
  color: ${({ theme }) => theme.textColors.default};
  margin-bottom: ${({ theme }) => theme.spacing.spacing4};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.spacing4};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.spacing2};
`;

const Label = styled.label`
  font: ${({ theme }) => theme.typography.body2Bold};
  color: ${({ theme }) => theme.textColors.default};
`;

const Input = styled.input`
  height: 48px;
  padding: 0 ${({ theme }) => theme.spacing.spacing3};
  border: 1px solid ${({ theme }) => theme.borderColors.default};
  border-radius: 8px;
  font: ${({ theme }) => theme.typography.body2Regular};
  background-color: ${({ theme }) => theme.backgroundColors.default};
  color: ${({ theme }) => theme.textColors.default};

  &::placeholder {
    color: ${({ theme }) => theme.textColors.placeholder};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.blue600};
  }
`;

const SubmitButton = styled.button<{ disabled: boolean }>`
  height: 48px;
  border: none;
  border-radius: 8px;
  font: ${({ theme }) => theme.typography.body2Bold};
  background-color: ${({ disabled }) =>
    disabled ? '#ccc' : ({ theme }) => theme.colors.blue600};
  color: white;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  margin-top: ${({ theme }) => theme.spacing.spacing2};

  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? '#ccc' : ({ theme }) => theme.colors.blue700};
  }
`; 