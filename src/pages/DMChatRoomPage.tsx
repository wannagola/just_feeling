/** @jsxImportSource @emotion/react */
import React from 'react';                    // ← React import 추가
import { css } from '@emotion/react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';  // ← FormEvent 제거
import chatLogData from '../../public/chatLog.json';
import users from '../../public/userName.json';

// 내 userID
const myID = 1001;

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

const chatContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  &:hover {
    background: #0056b3;
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

type LogItem = {
  messageId: number;
  senderID: number;
  content: string;
  timestamp: string;
};

const dmChatRoomPage = () => {
  const { chatRoomId } = useParams<{ chatRoomId: string }>();
  const roomIdNum = Number(chatRoomId);

  const [logs, setLogs] = useState<LogItem[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const room = chatLogData.find((r) => r.chatRoomId === roomIdNum);
    if (room) {
      const sorted = [...room.chatLog].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      setLogs(sorted);
    }
  }, [roomIdNum]);

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const newMessage: LogItem = {
      messageId: logs.length > 0 ? logs[logs.length - 1].messageId + 1 : 1,
      senderID: myID,
      content: text,
      timestamp: new Date().toISOString(),
    };

    setLogs((prev) => [...prev, newMessage]);
    setInput('');
  };

  return (
    <div css={pageStyle}>
      <div css={chatContainerStyle}>
        {logs.map((msg) => {
          const isMine = msg.senderID === myID;
          return (
            <div
              key={msg.messageId}
              css={[
                messageWrapperStyle,
                isMine ? myWrapperStyle : otherWrapperStyle,
              ]}
            >
              <div css={isMine ? myBubbleStyle : otherBubbleStyle}>
                <div css={senderInfoStyle}>
                  {userMap[msg.senderID] || `User ${msg.senderID}`}
                </div>
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
      </div>

      <form css={formStyle} onSubmit={handleSend}>
        <input
          css={inputStyle}
          type="text"
          value={input}
          placeholder="메시지를 입력하세요..."
          onChange={(e) => setInput(e.target.value)}
        />
        <button css={sendButtonStyle} type="submit">
          보내기
        </button>
      </form>
    </div>
  );
};

export default dmChatRoomPage;