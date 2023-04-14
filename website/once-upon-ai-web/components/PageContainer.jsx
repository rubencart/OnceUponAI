import React from "react";
import styled from "@emotion/styled";
import Header from "./Header";
import Footer from "./Footer";
import BackgroundCanvas from "./BackgroundCanvas";
import Script from "next/script";
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
      <Script type="text/javascript" src="./js/background.js" async />
    </LayoutContainer>
  );
};

export default PageContainer;
