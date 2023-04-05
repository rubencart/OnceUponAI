import Head from "next/head";
import styled from "@emotion/styled";
import WidthContainer from "../components/WidthContainer";
import PageContainer from "../components/PageContainer";

const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
`;

export default function AboutNerdlab() {
  return (
    <div>
      <Head>
        <title>About Nerdlab</title>
        <meta name="description" content="About Nerdlab" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageContainer>
        <WidthContainer>
          <CenterContainer>
            <h2>About Nerdlab</h2>
          </CenterContainer>
        </WidthContainer>
      </PageContainer>
    </div>
  );
}
