import styled from '@emotion/styled';
import { useEffect } from 'react';
import NavigationBar from '@/components/common/NavigationBar';
import LoginPage from '@/pages/loginpage';
import RegisterPage from '@/pages/registerpage';
import EditUserPage from '@/pages/edituserpage';
import NotFoundPage from '@/pages/NotFoundPage';
import DMPage from '@/pages/dmpage';
import ProfilePage from '@/pages/profilepage';
import HomePage from '@/pages/homepage';
import CreatePostPage from '@/pages/createpostpage'; 
import EditPostPage from '@/pages/editpostpage';
import DMChatRoomPage from '@/pages/DMChatRoomPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useUserStore } from '@/stores/useUserStore';

function App() {
  const { initializeFromStorage, checkTokenValidity } = useUserStore();

  useEffect(() => {
    const initializeApp = async () => {
      // 스토리지에서 사용자 정보 초기화
      initializeFromStorage();
      
      // 토큰이 있다면 유효성 검사
      await checkTokenValidity();
    };

    initializeApp();
  }, [initializeFromStorage, checkTokenValidity]);

  return (
    <Router>
      <AppContainer>
        <AppInner>
          <NavigationBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dm" element={<DMPage />} />
            <Route path="/profilepage" element={<ProfilePage />} />
            <Route path="/edit-profile" element={<EditUserPage />} />
            <Route path="/create" element={<CreatePostPage />} /> 
            <Route path="/edit-post/:postId" element={<EditPostPage />} />
            <Route path="/dmchatroom/:chatRoomId" element={<DMChatRoomPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppInner>
      </AppContainer>
    </Router>
  );
}

export default App;

const AppContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.gray1000};
  min-height: 100vh;
`;

const AppInner = styled.div`
  max-width: 720px;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.gray00};
  min-height: 100vh;
`;
