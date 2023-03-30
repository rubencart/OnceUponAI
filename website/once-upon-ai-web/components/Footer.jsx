import styled from "@emotion/styled";

const FOOTER_HEIGHT = "50px";

const StyledFooter = styled.footer`
  height: ${FOOTER_HEIGHT};
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #ececec;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function Footer() {
  return (
    <StyledFooter>
      <a href="https://nerdlab.be" target="_blank" rel="noopener noreferrer">
        Created for Nerdlab
      </a>
    </StyledFooter>
  );
}
