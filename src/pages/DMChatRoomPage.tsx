/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ApiService } from '@/services/api';
import { webSocketService } from '@/services/websocketService';
import { useUserStore } from '@/stores/useUserStore';

interface ChatMessage {
  messageId: number;
  senderID: number;
  content: string;
  timestamp: string;
}

interface User {
  userID: number;
  userName: string;
}

// Emotion 스타일
const pageStyle = css`
  padding: 2rem;
  font-size: 1.2rem;
`;

const chatContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 70vh;
  overflow-y: auto;
  padding: 1rem;
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

const formStyle = css`
  margin-top: 2rem;
  display: flex;
  gap: 0.5rem;
`;

const inputStyle = css`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  font-size: 1rem;
`;

const sendButtonStyle = css`
  padding: 0.5rem 1rem;
  border: none;
  background: #007bff;
  color: #fff;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
  
  &:hover:not(:disabled) {
    background: #0056b3;
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
    opacity: 0.65;
  }
`;

const messageWrapperStyle = css`
  display: flex;
`;
const myWrapperStyle = css`
  justify-content: flex-start;
`;
const otherWrapperStyle = css`
  justify-content: flex-end;
`;

const bubbleBaseStyle = css`
  max-width: 60%;
  padding: 0.8rem 0.8rem 1.8rem;
  border-radius: 0.8rem;
  position: relative;
  word-break: break-word;
`;
const otherBubbleStyle = css`
  ${bubbleBaseStyle};
  background: #f1f1f1;
`;
const myBubbleStyle = css`
  ${bubbleBaseStyle};
  background: #fff9c4;
`;

const senderInfoStyle = css`
  font-weight: bold;
  margin-bottom: 0.2rem;
`;

const timestampStyle = css`
  font-size: 0.75rem;
  color: #888;
  position: absolute;
  bottom: 4px;
  right: 8px;
`;

// 연결 상태 스타일
const connectionStatusStyle = css`
  padding: 0.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  text-align: center;
  font-size: 0.9rem;
`;

const statusIndicatorStyle = css`
  font-weight: 500;
`;

const connectedStyle = css`
  color: #28a745;
`;

const disconnectedStyle = css`
  color: #ffc107;
`;

// 시스템 메시지 스타일
const systemWrapperStyle = css`
  justify-content: center;
`;

const systemBubbleStyle = css`
  background: #e9ecef;
  color: #6c757d;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  text-align: center;
  max-width: 80%;
`;

// 타이핑 인디케이터 스타일
const typingIndicatorStyle = css`
  padding: 0.5rem 1rem;
  color: #6c757d;
  font-style: italic;
  font-size: 0.9rem;
  background: #f8f9fa;
  border-radius: 1rem;
  margin: 0.5rem 0;
  animation: pulse 1.5s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
`;



const dmChatRoomPage = () => {
  const { chatRoomId } = useParams<{ chatRoomId: string }>();
  const roomIdNum = Number(chatRoomId);
  const { user, isLoggedIn } = useUserStore();

  const [logs, setLogs] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 로그인하지 않은 경우 처리
  if (!isLoggedIn || !user) {
    return <div>로그인이 필요합니다.</div>;
  }

  const myID = user.userID;

  // userID → userName 맵
  const userMap: Record<number, string> = users.reduce((map, user) => {
    map[user.userID] = user.userName;
    return map;
  }, {} as Record<number, string>);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        // 기존 메시지와 사용자 데이터 로드
        const [messagesResponse, usersResponse] = await Promise.all([
          ApiService.getChatMessages(roomIdNum),
          ApiService.getAllUsers()
        ]);
        setLogs(messagesResponse);
        setUsers(usersResponse);

        // WebSocket 연결 및 채팅방 구독
        await webSocketService.connect();
        webSocketService.subscribeToChatRoom(roomIdNum);

        // WebSocket 이벤트 리스너 설정
        webSocketService.setOnMessageReceived((message) => {
          setLogs((prevLogs) => {
            // 중복 메시지 방지
            const isDuplicate = prevLogs.some(log => 
              log.messageId === message.messageId || 
              (log.content === message.content && 
               log.senderID === message.senderID && 
               Math.abs(new Date(log.timestamp).getTime() - new Date(message.timestamp).getTime()) < 1000)
            );
            
            if (!isDuplicate) {
              return [...prevLogs, message];
            }
            return prevLogs;
          });
        });

        webSocketService.setOnTypingStatusChanged((typingInfo) => {
          setTypingUsers((prev) => {
            const newSet = new Set(prev);
            if (typingInfo.isTyping && typingInfo.userId !== myID) {
              newSet.add(typingInfo.userId);
            } else {
              newSet.delete(typingInfo.userId);
            }
            return newSet;
          });
        });

        webSocketService.setOnConnectionChanged((connected) => {
          setIsConnected(connected);
          if (connected) {
            console.log('실시간 채팅이 활성화되었습니다.');
          } else {
            console.log('실시간 채팅 연결이 끊어졌습니다.');
          }
        });

        // 채팅방 입장 알림 (현재 사용자 정보 찾기)
        const currentUser = usersResponse.find((user: User) => user.userID === myID);
        if (currentUser) {
          webSocketService.joinChatRoom(roomIdNum, myID, currentUser.userName);
        }

      } catch (error) {
        console.error('채팅 초기화 실패:', error);
        // 에러 발생 시 기본 데이터 사용
        setUsers([
          { userID: 1, userName: "T7" },
          { userID: 2, userName: "A1" },
          { userID: 3, userName: "Z9" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();

    // 컴포넌트 언마운트 시 정리
    return () => {
      const currentUser = users.find((user: User) => user.userID === myID);
      if (currentUser) {
        webSocketService.leaveChatRoom(roomIdNum, myID, currentUser.userName);
      }
      webSocketService.unsubscribeFromChatRoom(roomIdNum);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [roomIdNum]);

  // 자동 스크롤
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    // 타이핑 상태 해제
    handleStopTyping();

    if (isConnected) {
      // WebSocket을 통한 실시간 전송
      webSocketService.sendMessage(roomIdNum, myID, text);
      setInput('');
    } else {
      // 연결되지 않은 경우 재연결 시도
      console.warn('WebSocket이 연결되지 않았습니다. 재연결을 시도합니다.');
      try {
        await webSocketService.connect();
        webSocketService.sendMessage(roomIdNum, myID, text);
        setInput('');
      } catch (error) {
        console.error('WebSocket 재연결 실패:', error);
        alert('채팅 서버에 연결할 수 없습니다. 페이지를 새로고침해주세요.');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    handleStartTyping();
  };

  const handleStartTyping = () => {
    if (!isConnected) return;

    const currentUser = users.find((user: User) => user.userID === myID);
    if (currentUser) {
      webSocketService.sendTypingStatus(roomIdNum, myID, currentUser.userName, true);
    }

    // 이전 타이머 클리어
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // 3초 후 타이핑 상태 해제
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 3000);
  };

  const handleStopTyping = () => {
    if (!isConnected) return;

    const currentUser = users.find((user: User) => user.userID === myID);
    if (currentUser) {
      webSocketService.sendTypingStatus(roomIdNum, myID, currentUser.userName, false);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  if (loading) {
    return (
      <div css={pageStyle}>
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <div css={pageStyle}>
      {/* 연결 상태 표시 */}
      <div css={connectionStatusStyle}>
        <span css={[statusIndicatorStyle, isConnected ? connectedStyle : disconnectedStyle]}>
          {isConnected ? '● 실시간 연결됨' : '○ 연결 중...'}
        </span>
      </div>

      <div css={chatContainerStyle} ref={chatContainerRef}>
        {logs.map((msg) => {
          const isMine = msg.senderID === myID;
          const isSystemMessage = msg.senderID === -1;
          
          return (
            <div
              key={msg.messageId}
              css={[
                messageWrapperStyle,
                isSystemMessage ? systemWrapperStyle :
                isMine ? myWrapperStyle : otherWrapperStyle,
              ]}
            >
              <div css={
                isSystemMessage ? systemBubbleStyle :
                isMine ? myBubbleStyle : otherBubbleStyle
              }>
                {!isSystemMessage && (
                  <div css={senderInfoStyle}>
                    {userMap[msg.senderID] || `User ${msg.senderID}`}
                  </div>
                )}
                <div>{msg.content}</div>
                <div css={timestampStyle}>
                  {new Date(msg.timestamp).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* 타이핑 상태 표시 */}
        {typingUsers.size > 0 && (
          <div css={typingIndicatorStyle}>
            {Array.from(typingUsers).map(userId => {
              const username = userMap[userId] || `User ${userId}`;
              return `${username}`;
            }).join(', ')}님이 입력 중...
          </div>
        )}
      </div>

      <form css={formStyle} onSubmit={handleSend}>
        <input
          css={inputStyle}
          type="text"
          value={input}
          placeholder="메시지를 입력하세요..."
          onChange={handleInputChange}
          onBlur={handleStopTyping}
        />
        <button css={sendButtonStyle} type="submit" disabled={!input.trim()}>
          {isConnected ? '전송' : '연결 중...'}
        </button>
      </form>
    </div>
  );
};

export default dmChatRoomPage;