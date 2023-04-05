import Head from "next/head";
import Chatbot from "react-chatbot-kit";
import ActionProvider from "../chatbot/ActionProvider";
import MessageParser from "../chatbot/MessageParser";
import chatbotConfig from "../chatbot/chatbotConfig";
import styled from "@emotion/styled";
import WidthContainer from "../components/WidthContainer";
import PageContainer from "../components/PageContainer";

const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
`;

export default function StartYourTour() {
  return (
    <div>
      <Head>
        <title>Once Upon AI</title>
        <meta name="description" content="Start Your Tour" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageContainer>
        <WidthContainer>
          <CenterContainer>
            <h2>Star Your Tour</h2>
            <Chatbot config={chatbotConfig} messageParser={MessageParser} actionProvider={ActionProvider} />
          </CenterContainer>
        </WidthContainer>
      </PageContainer>
    </div>
  );
}
