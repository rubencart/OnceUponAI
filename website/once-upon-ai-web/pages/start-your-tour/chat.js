import Head from "next/head";
import Chatbot from "react-chatbot-kit";
import styled from "@emotion/styled";
import Image from "next/image";
import ActionProvider from "@/chatbot/ActionProvider";
import MessageParser from "@/chatbot/MessageParser";
import chatbotConfig from "@/chatbot/chatbotConfig";
import WidthContainer from "@/components/WidthContainer";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import CenteredPageContainer from "@/components/CenteredPageContainer";

const ChatWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;

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

const RobotImage = styled(Image)`
  @media (max-width: 768px) {
    display: none;
  }
`;

const Sidebar = styled.div`
  width: 400px;
  border-left: 1px solid black;
  padding: 16px;
  margin-left: 32px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    border-left: none;
    border-top: 1px solid black;
    margin-left: 0;
  }
`;

const FaqItem = styled.div`
  margin: 8px 0;

  h2,
  p {
    font-size: 0.9rem;
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

  const FaqItems = [
    {
      question: "Waarom?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu nisi bibendum risus iaculis vestibulum.",
    },
    {
      question: "Hoe werkt dit?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu nisi bibendum risus iaculis vestibulum.",
    },
    {
      question: "Wat is ChatGPT?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu nisi bibendum risus iaculis vestibulum.",
    },
    {
      question: "Is mijn persoonlijke data veilig bij jullie?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu nisi bibendum risus iaculis vestibulum.",
    },
    {
      question: "Andere vragen?",
      answer:
        "Contacteer de makers van dit project, dit kan via de Discord van Nerdlab",
    },
  ];

  return (
    <div>
      <Head>
        <title>Chat met Jos</title>
        <meta name="description" content="Chat met Jos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CenteredPageContainer>
        <WidthContainer>
          <ChatWrapper>
            <RobotImage src="./../robot.svg" width={250} height={250} alt="Robot Image" />
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
              {!hasFinishedChatting && <StopChatting href="/start-your-tour">Stop met praten</StopChatting>}
            </ChatbotContainer>
            <Sidebar>
              <h1>Veelgestelde vragen</h1>
              {FaqItems.map((item, index) => (
                <FaqItem key={index}>
                  <h2>{item.question}</h2>
                  <p>{item.answer}</p>
                </FaqItem>
              ))}
            </Sidebar>
          </ChatWrapper>
        </WidthContainer>
      </CenteredPageContainer>
    </div>
  );
}
