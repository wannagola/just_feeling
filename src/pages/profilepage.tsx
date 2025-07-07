/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const ProfilePage = () => {
  return (
    <div
      css={css`
        padding: 2rem;
        font-size: 1.2rem;
        color: #000;
      `}
    >
      🧑‍💻 내 프로필 페이지입니다.
      <br />
      여기에 사용자 정보와 수정 폼이 들어갈 예정입니다.
    </div>
  );
};

export default ProfilePage;
