import styled from "@emotion/styled";

const FOOTER_HEIGHT = "50px";

const StyledFooter = styled.footer`
  height: ${FOOTER_HEIGHT};
  background-color: #ececec;
  padding: 1rem 2rem;
  text-align: center;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
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
