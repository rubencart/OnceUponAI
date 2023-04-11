import React from "react";
import styled from "@emotion/styled";
import Header from "./Header";
import Footer from "./Footer";

const LayoutContainer = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto; // header, content, footer
  min-height: 100vh;
`;

const MainContent = styled.main`
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const CenteredPageContainer = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <MainContent>{children}</MainContent>
      <Footer />
    </LayoutContainer>
  );
};

export default CenteredPageContainer;
