import styled from "@emotion/styled";

const HEADER_HEIGHT = "80px";

const BackgroundContainer = styled.header`
  background-color: #ececec;
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${HEADER_HEIGHT};
`;

export default function Header() {
  return (
    <BackgroundContainer>
      <ContentContainer>
        <h1>Nerdlab</h1>
      </ContentContainer>
    </BackgroundContainer>
  );
}
