const API_BASE_URL = 'http://localhost:8080/emoai';

export class ApiService {
  private static async fetchApi(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API 요청 실패');
    }
    
    return data;
  }

  // 인증 관련 API
  static async login(email: string, password: string) {
    return this.fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async register(userName: string, email: string, password: string) {
    return this.fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ userName, email, password }),
    });
  }

  // 포스트 관련 API
  static async getAllPosts() {
    return this.fetchApi('/posts');
  }

  static async createPost(userId: string, emotion: string, contentText: string, contentImage?: string) {
    return this.fetchApi('/posts', {
      method: 'POST',
      body: JSON.stringify({ userId, emotion, contentText, contentImage }),
    });
  }

  static async getPostsByUser(userId: string) {
    return this.fetchApi(`/posts/user/${userId}`);
  }

  // 사용자 관련 API
  static async getAllUsers() {
    return this.fetchApi('/users');
  }

  static async getUserById(userId: number) {
    return this.fetchApi(`/users/${userId}`);
  }

  static async getUserByUserName(userName: string) {
    return this.fetchApi(`/users/username/${userName}`);
  }

  // 채팅 관련 API
  static async getChatRooms() {
    return this.fetchApi('/chat/rooms');
  }

  static async getChatMessages(chatRoomId: number) {
    return this.fetchApi(`/chat/rooms/${chatRoomId}/messages`);
  }

  static async sendMessage(chatRoomId: number, senderID: number, content: string) {
    return this.fetchApi('/chat/messages', {
      method: 'POST',
      body: JSON.stringify({ chatRoomId, senderID, content }),
    });
  }

  static async createChatRoom(title: string, participants: string, senderID: number) {
    return this.fetchApi('/chat/rooms', {
      method: 'POST',
      body: JSON.stringify({ title, participants, senderID }),
    });
  }
} 