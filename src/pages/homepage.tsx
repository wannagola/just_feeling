/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';

const HomePage = () => {
  const theme = useTheme();

  return (
    <div
      css={css`
        padding: 2rem;
        background-color: ${theme.colors.gray00};
        color: ${theme.colors.gray1000};
        min-height: 100vh;
        font-size: 1.2rem;
        text-align: center;
      `}
    >
      여기는 감정 분석 피드가 표시될 메인 페이지입니다.
    </div>
  );
};

export default HomePage;
