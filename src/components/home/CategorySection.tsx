import styled from '@emotion/styled';


const CategorySection = () => {
  return (
    <Section>
      <Title>오늘의 피드</Title>
      <Grid>
      </Grid>
    </Section>
  );
};

export default CategorySection;

const Section = styled.section`
  margin-top: 24px;
`;

const Title = styled.h2`
  font: ${({ theme }) => theme.typography.title2Bold};
  color: ${({ theme }) => theme.textColors.default};
  padding: 0 16px;
  margin-bottom: 12px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px 8px;
  padding: 0 16px;
`;
