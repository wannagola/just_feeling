import styled from '@emotion/styled';

// 전체 화면을 덮는 오버레이
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

// 모달 컨테이너: 높이를 70vh로 설정
const ModalContainer = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  height: 70vh;
  display: flex;
  flex-direction: column;
`;

// 제목 영역: 제목과 닫기 버튼을 가로 배치
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  margin: 0;
`;

// 닫기 버튼 스타일
const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
`;

// 댓글 리스트 또는 메시지를 표시하는 영역
const Content = styled.div`
  flex: 1;
  overflow-y: auto;
`;

// 댓글이 없을 때 중앙에 메시지 표시
const NoComments = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
  font-size: 1rem;
`;

type CommentModalProps = {
  postId: number;
  onClose: () => void;
};

const CommentModal = ({ onClose }: CommentModalProps) => {
  // 실제 댓글 로딩 로직을 추가하여 comments 배열을 업데이트하세요
  const comments: { id: number; text: string }[] = [];

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Title>댓글</Title>
          <CloseButton onClick={onClose} aria-label="닫기">×</CloseButton>
        </ModalHeader>
        <Content>
          {comments.length === 0 ? (
            <NoComments>댓글이 없습니다.</NoComments>
          ) : (
            comments.map((comment) => (
              <div key={comment.id}>{comment.text}</div>
            ))
          )}
        </Content>
      </ModalContainer>
    </Overlay>
  );
};

export default CommentModal;
