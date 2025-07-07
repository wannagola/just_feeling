/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import chatRooms from '../../public/chatRoomData.json';
import users from '../../public/userName.json';

// userID → userName 맵
const userMap: Record<number, string> = users.reduce((map, user) => {
  map[user.userID] = user.userName;
  return map;
}, {} as Record<number, string>);

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

  return (
    <div css={pageStyle}>
      <h2>✉️ DM 페이지</h2>
      <div css={listContainerStyle}>
        {chatRooms.map((room) => (
          <div
            key={room.chatRoomId}
            css={roomItemStyle}
            onClick={() => navigate(`/dm/${room.chatRoomId}`)}
          >
            <h3 css={roomTitleStyle}>{room.title}</h3>
            <p css={roomParticipantsStyle}>
              Participants:{' '}
              {room.participants.map((id) => userMap[id] || id).join(', ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DMPage;
