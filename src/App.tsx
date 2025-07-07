import styled from '@emotion/styled';
import NavigationBar from '@/components/common/NavigationBar';
import CategorySection from '@/components/home/CategorySection';
import BannerSection from '@/components/home/BannerSection';
import LoginPage from '@/pages/loginpage';
import NotFoundPage from '@/pages/NotFoundPage';
import DMPage from '@/pages/dmpage';
import ProfilePage from '@/pages/profilepage';

import DMChatRoomPage from '@/pages/DMChatRoomPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <AppContainer>
        <AppInner>
          <NavigationBar />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <CategorySection />
                  <BannerSection />
                </>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dm" element={<DMPage />} />
            <Route path="/profilepage" element={<ProfilePage />} />
            <Route path="/dm/:chatRoomId" element={<DMChatRoomPage />} />
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
