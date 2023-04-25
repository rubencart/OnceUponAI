import Head from "next/head";
import Chatbot from "react-chatbot-kit";
import styled from "@emotion/styled";
import Image from "next/image";
import ActionProvider from "@/chatbot/ActionProvider";
import MessageParser from "@/chatbot/MessageParser";
import chatbotConfig from "@/chatbot/chatbotConfig";
import WidthContainer from "@/components/WidthContainer";
import Link from "next/link";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import CenteredPageContainer from "@/components/CenteredPageContainer";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { RouteContext } from "@/context/RouteContext";

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

const StartRoute = styled.button`
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

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

async function createWalk(nbLocations, messages) {
  // TODO: Replace http://127.0.0.1:8000/ with host once deployed
  const response = await fetch("http://127.0.0.1:8000/api/walk", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nb_locations: nbLocations,
      messages: messages,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create walk");
  }

  const data = await response.json();
  return data;
}

export default function Chat() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setRouteObjects } = useContext(RouteContext);

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
      question: t("index_faq_1_question"),
      answer: t("index_faq_1_answer"),
    },
    {
      question: t("index_faq_2_question"),
      answer: t("index_faq_2_answer"),
    },
    {
      question: t("index_faq_3_question"),
      answer: t("index_faq_3_answer"),
    },
    {
      question: t("index_faq_4_question"),
      answer: t("index_faq_4_answer"),
    },
    {
      question: t("index_faq_5_question"),
      answer: t("index_faq_5_answer"),
    },
  ];

  async function goToRoute() {
    // TODO: Add messages as param
    let pois = await createWalk(10, []);
    console.log("Created walk with pois:", pois);
    setRouteObjects(pois);
    router.push("/start-your-tour/route");
  }

  return (
    <div>
      <Head>
        <title>{t("chat_with_jos")}</title>
        <meta name="description" content="Chat met Jos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CenteredPageContainer>
        <WidthContainer>
          <ChatWrapper>
            <RobotImage src="/robot.svg" width={250} height={250} alt="Robot Image" />
            <ChatbotContainer>
              <Chatbot config={updatedConfig} messageParser={MessageParser} actionProvider={ActionProvider} />
              {hasFinishedChatting && (
                <>
                  <StartRoute onClick={goToRoute}>{t("start_route")}</StartRoute>
                  <StopChatting href="/start-your-tour/chat" onClick={() => router.reload()}>
                    {t("start_again")}
                  </StopChatting>
                </>
              )}
              {!hasFinishedChatting && <StopChatting href="/start-your-tour">{t("stop_talking")}</StopChatting>}
            </ChatbotContainer>
            <Sidebar>
              <h1>{t("faq_title_long")}</h1>
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
