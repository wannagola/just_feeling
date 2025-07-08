/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ApiService } from '@/services/api';

interface ChatRoom {
  chatRoomId: number;
  title: string;
  participants: string;
  senderID: number;
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

const listContainerStyle = css`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const roomItemStyle = css`
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #f9f9f9;
  }
`;

const roomTitleStyle = css`
  margin: 0;
  font-size: 1.1rem;
`;

const roomParticipantsStyle = css`
  margin: 0.5rem 0 0;
  font-size: 0.95rem;
  color: #555;
`;

const DMPage = () => {
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // userID → userName 맵
  const userMap: Record<number, string> = users.reduce((map, user) => {
    map[user.userID] = user.userName;
    return map;
  }, {} as Record<number, string>);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chatRoomsResponse, usersResponse] = await Promise.all([
          ApiService.getChatRooms(),
          ApiService.getAllUsers()
        ]);
        setChatRooms(chatRoomsResponse);
        setUsers(usersResponse);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        // 에러 발생 시 기본 데이터 사용
        setChatRooms([
          { chatRoomId: 1, title: "가족 단체 채팅", participants: "[1, 2, 3, 4]", senderID: 1 },
          { chatRoomId: 2, title: "친구와의 수다", participants: "[2, 3, 4]", senderID: 2 },
        ]);
        setUsers([
          { userID: 1, userName: "T7" },
          { userID: 2, userName: "A1" },
          { userID: 3, userName: "Z9" },
          { userID: 4, userName: "M5" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div css={pageStyle}>
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <div css={pageStyle}>
      <h2>✉️ DM 페이지</h2>
      <div css={listContainerStyle}>
        {chatRooms.map((room) => {
          const participantIds = JSON.parse(room.participants);
          return (
            <div
              key={room.chatRoomId}
              css={roomItemStyle}
              onClick={() => navigate(`/dm/${room.chatRoomId}`)}
            >
              <h3 css={roomTitleStyle}>{room.title}</h3>
              <p css={roomParticipantsStyle}>
                Participants:{' '}
                {participantIds.map((id: number) => userMap[id] || id).join(', ')}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DMPage;