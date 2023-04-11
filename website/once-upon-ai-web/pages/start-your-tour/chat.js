import Head from "next/head";
import Chatbot from "react-chatbot-kit";
import styled from "@emotion/styled";
import Image from "next/image";
import ActionProvider from "@/chatbot/ActionProvider";
import MessageParser from "@/chatbot/MessageParser";
import chatbotConfig from "@/chatbot/chatbotConfig";
import WidthContainer from "@/components/WidthContainer";
import PageContainer from "@/components/PageContainer";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

const CenterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80vh;
`;

const ChatWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ChatbotContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
`;

// FIXME: Change to button
const StopChatting = styled(Link)`
  color: red;
  font-size: 0.8rem;
  padding: 4px 8px;
  border-bottom: 1px solid transparent;

  &:hover {
    border-bottom: 1px solid red;
  }
`;

const StartRoute = styled(Link)`
  border: 1px solid black;
  padding: 8px 16px;
  margin-top: 8px;

  &:hover {
    opacity: 0.67;
    transform: scale(0.95);
  }
`;

export default function Chat() {
  const router = useRouter();

  const [hasFinishedChatting, setHasFinishedChatting] = useState(false);

  // FIXME: Not sure if this is the best way to call the func but it works
  const updatedConfig = {
    ...chatbotConfig,
    widgets: [
      {
        widgetName: "setHasFinishedChattingTrue",
        widgetFunc: () => setHasFinishedChatting(true),
      },
    ],
  };

  return (
    <div>
      <Head>
        <title>Chat met Jos</title>
        <meta name="description" content="Chat met Jos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageContainer>
        <WidthContainer>
          <CenterContainer>
            <ChatWrapper>
              <Image src="./../robot.svg" width={300} height={200} alt="Robot Image" />
              <ChatbotContainer>
                <Chatbot config={updatedConfig} messageParser={MessageParser} actionProvider={ActionProvider} />
                {hasFinishedChatting && (
                  <>
                    <StartRoute href="/start-your-tour/route">Start Route</StartRoute>
                    <StopChatting href="/start-your-tour/chat" onClick={() => router.reload()}>
                      Begin opnieuw
                    </StopChatting>
                  </>
                )}
                {!hasFinishedChatting && (
                  // TODO: Remove "Start Route" button
                  <>
                    <StartRoute href="/start-your-tour/route">Start Route</StartRoute>
                    <StopChatting href="/start-your-tour">Stop met praten</StopChatting>
                  </>
                )}
              </ChatbotContainer>
            </ChatWrapper>
          </CenterContainer>
        </WidthContainer>
      </PageContainer>
    </div>
  );
}
