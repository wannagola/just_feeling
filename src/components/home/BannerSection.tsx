/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';

const BannerSection = () => {
  const theme = useTheme();

  return (
    <section
      css={css`
        margin: 1rem;
        border-radius: 8px;
        background-color: ${theme.colors.gray1000}; // 검정 배경
        color: ${theme.colors.gray00}; // 흰 텍스트
        padding: 1.5rem;
        text-align: center;
        font-size: 1.1rem;
        font-weight: 500;
      `}
    >
      🎉 지금 당신의 감정을 기록해보세요!
    </section>
  );
};

export default BannerSection;
