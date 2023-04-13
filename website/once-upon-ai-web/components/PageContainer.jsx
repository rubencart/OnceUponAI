import React from "react";
import styled from "@emotion/styled";
import Header from "./Header";
import Footer from "./Footer";
import BackgroundCanvas from "./BackgroundCanvas";
const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
`;

const PageContainer = ({ children }) => {
  return (
    <LayoutContainer>
      <BackgroundCanvas />
      <Header />
      <MainContent>{children}</MainContent>
      <Footer />
      <script type="text/javascript" src="./js/background.js" />
    </LayoutContainer>

  );
};

export default PageContainer;
