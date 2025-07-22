import { create } from 'zustand';

interface User {
  userID: number;
  userName: string;
  email: string;
}

interface UserState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  initializeFromStorage: () => void;
  checkTokenValidity: () => Promise<boolean>;
}

export const useUserStore = create<UserState>((set, get) => ({
  isLoggedIn: false,
  user: null,
  token: null,
  
  login: (user: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ isLoggedIn: true, user, token });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ isLoggedIn: false, user: null, token: null });
  },
  
  initializeFromStorage: () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        set({ isLoggedIn: true, user, token: storedToken });
      } catch (error) {
        console.error('사용자 정보 파싱 실패:', error);
        get().logout();
      }
    }
  },
  
  checkTokenValidity: async () => {
    const { token } = get();
    if (!token) return false;
    
    try {
      const { ApiService } = await import('@/services/api');
      const isValid = await ApiService.validateToken(token);
      
      if (!isValid) {
        get().logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('토큰 검증 실패:', error);
      get().logout();
      return false;
    }
  },
}));
