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
    
    // 응답 본문이 있는지 확인
    const contentType = response.headers.get('content-type');
    let data = null;
    
    if (contentType && contentType.includes('application/json')) {
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (error) {
        console.error('JSON 파싱 에러:', error);
        data = { message: '서버 응답을 처리할 수 없습니다.' };
      }
    } else {
      data = { message: `서버 에러 (${response.status}): ${response.statusText}` };
    }
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
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

  static async validateToken(token: string) {
    try {
      const response = await this.fetchApi('/auth/validate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.success;
    } catch (error) {
      return false;
    }
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

  static async updatePost(postId: number, emotion: string, contentText: string, contentImage?: string) {
    return this.fetchApi(`/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify({ emotion, contentText, contentImage }),
    });
  }

  static async deletePost(postId: number) {
    return this.fetchApi(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  // 좋아요 관련 API
  static async toggleLike(postId: number, userId: string) {
    return this.fetchApi(`/likes/posts/${postId}/toggle?userId=${userId}`, {
      method: 'POST',
    });
  }

  static async getLikeInfo(postId: number, userId?: string) {
    const userParam = userId ? `?userId=${userId}` : '';
    return this.fetchApi(`/likes/posts/${postId}${userParam}`);
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

  static async updateProfile(userId: number, userName: string, email: string) {
    return this.fetchApi(`/users/${userId}/profile`, {
      method: 'PUT',
      body: JSON.stringify({ userName, email }),
    });
  }

  static async changePassword(userId: number, currentPassword: string, newPassword: string) {
    return this.fetchApi(`/users/${userId}/password`, {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
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