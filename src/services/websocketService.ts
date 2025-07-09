import { Client, type IMessage, StompConfig } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface ChatMessage {
  messageId: number;
  chatRoomId: number;
  senderID: number;
  content: string;
  timestamp: string;
}

interface TypingInfo {
  userId: number;
  username: string;
  isTyping: boolean;
}

export class WebSocketService {
  private client: Client | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // 1초

  // 콜백 함수들
  private onMessageReceived: ((message: ChatMessage) => void) | null = null;
  private onTypingStatusChanged: ((typingInfo: TypingInfo) => void) | null = null;
  private onConnectionChanged: ((connected: boolean) => void) | null = null;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    const config: StompConfig = {
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {},
      debug: (msg: string) => {
        console.log('[WebSocket Debug]', msg);
      },
      reconnectDelay: this.reconnectDelay,
      onConnect: () => {
        console.log('WebSocket 연결 성공');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.onConnectionChanged?.(true);
      },
      onDisconnect: () => {
        console.log('WebSocket 연결 끊김');
        this.isConnected = false;
        this.onConnectionChanged?.(false);
      },
      onStompError: (frame) => {
        console.error('STOMP 오류:', frame);
        this.handleReconnect();
      },
      onWebSocketError: (error) => {
        console.error('WebSocket 오류:', error);
        this.handleReconnect();
      }
    };

    this.client = new Client(config);
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('최대 재연결 시도 횟수 초과');
    }
  }

  /**
   * WebSocket 연결 시작
   */
  connect(): Promise<void> {
    if (this.isConnected) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      if (!this.client) {
        this.initializeClient();
      }

      const onConnect = this.client!.onConnect;
      this.client!.onConnect = (frame) => {
        onConnect?.(frame);
        resolve();
      };

      const onStompError = this.client!.onStompError;
      this.client!.onStompError = (frame) => {
        onStompError?.(frame);
        reject(new Error('WebSocket 연결 실패'));
      };

      this.client!.activate();
    });
  }

  /**
   * WebSocket 연결 종료
   */
  disconnect() {
    if (this.client && this.isConnected) {
      this.client.deactivate();
      this.isConnected = false;
    }
  }

  /**
   * 특정 채팅방 구독
   */
  subscribeToChatRoom(chatRoomId: number) {
    if (!this.client || !this.isConnected) {
      console.warn('WebSocket이 연결되지 않았습니다.');
      return;
    }

    // 채팅 메시지 구독
    this.client.subscribe(`/topic/chat/${chatRoomId}`, (message: IMessage) => {
      try {
        const chatMessage: ChatMessage = JSON.parse(message.body);
        this.onMessageReceived?.(chatMessage);
      } catch (error) {
        console.error('메시지 파싱 오류:', error);
      }
    });

    // 타이핑 상태 구독
    this.client.subscribe(`/topic/chat/${chatRoomId}/typing`, (message: IMessage) => {
      try {
        const typingInfo: TypingInfo = JSON.parse(message.body);
        this.onTypingStatusChanged?.(typingInfo);
      } catch (error) {
        console.error('타이핑 상태 파싱 오류:', error);
      }
    });

    console.log(`채팅방 ${chatRoomId} 구독 완료`);
  }

  /**
   * 채팅방 구독 해제
   */
  unsubscribeFromChatRoom(chatRoomId: number) {
    // STOMP 클라이언트에서는 구독 ID를 통해 구독 해제해야 함
    // 실제 구현에서는 구독 시 ID를 저장해두고 여기서 해제
    console.log(`채팅방 ${chatRoomId} 구독 해제`);
  }

  /**
   * 메시지 전송
   */
  sendMessage(chatRoomId: number, senderID: number, content: string) {
    if (!this.client || !this.isConnected) {
      console.warn('WebSocket이 연결되지 않았습니다.');
      return;
    }

    const message = {
      chatRoomId,
      senderID,
      content
    };

    this.client.publish({
      destination: `/app/chat/${chatRoomId}`,
      body: JSON.stringify(message)
    });
  }

  /**
   * 채팅방 입장 알림
   */
  joinChatRoom(chatRoomId: number, userId: number, username: string) {
    if (!this.client || !this.isConnected) {
      console.warn('WebSocket이 연결되지 않았습니다.');
      return;
    }

    const userInfo = { userId, username };

    this.client.publish({
      destination: `/app/chat/${chatRoomId}/join`,
      body: JSON.stringify(userInfo)
    });
  }

  /**
   * 채팅방 퇴장 알림
   */
  leaveChatRoom(chatRoomId: number, userId: number, username: string) {
    if (!this.client || !this.isConnected) {
      console.warn('WebSocket이 연결되지 않았습니다.');
      return;
    }

    const userInfo = { userId, username };

    this.client.publish({
      destination: `/app/chat/${chatRoomId}/leave`,
      body: JSON.stringify(userInfo)
    });
  }

  /**
   * 타이핑 상태 전송
   */
  sendTypingStatus(chatRoomId: number, userId: number, username: string, isTyping: boolean) {
    if (!this.client || !this.isConnected) {
      return;
    }

    const typingInfo = { userId, username, isTyping };

    this.client.publish({
      destination: `/app/chat/${chatRoomId}/typing`,
      body: JSON.stringify(typingInfo)
    });
  }

  /**
   * 이벤트 리스너 등록
   */
  setOnMessageReceived(callback: (message: ChatMessage) => void) {
    this.onMessageReceived = callback;
  }

  setOnTypingStatusChanged(callback: (typingInfo: TypingInfo) => void) {
    this.onTypingStatusChanged = callback;
  }

  setOnConnectionChanged(callback: (connected: boolean) => void) {
    this.onConnectionChanged = callback;
  }

  /**
   * 연결 상태 확인
   */
  isWebSocketConnected(): boolean {
    return this.isConnected;
  }
}

// 싱글톤 인스턴스
export const webSocketService = new WebSocketService(); 