import Head from "next/head";
import Chatbot from "react-chatbot-kit";
import styled from "@emotion/styled";
import Image from "next/image";
import ActionProvider, { getAllMessages } from "@/chatbot/ActionProvider";
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
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

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
  font-family: "Mazius Review Extra", sans-serif;
  background-color: transparent;
  color: white;
  margin-top: 8px;
  box-sizing: border-box;
  position: relative;
  border: 1.5px solid white;
  padding: 8px 32px;
  text-align: center;
  overflow: hidden;
  -webkit-transition: all 1s ease;
  -moz-transition: all 1s ease;
  -o-transition: all 1s ease;
  transition: all 1s ease;

  &:hover {
    opacity: 0.67;
    transform: scale(0.95);
  }
  &:before,
  &:after {
    content: "";
    aspect-ratio: 1 / 1;
    height: calc(3px + 100%);
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    border-radius: 50%;
    border: 1.5px solid white;
    position: absolute;
    box-sizing: border-box;
  }
  &:after {
    right: 0;
    transform: translate(50%, -9.5px);
  }
  &:before {
    left: 0;
    transform: translate(-50%, -9.5px);
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
  margin: 16px 0;

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

async function createWalk(messages) {
  // TODO: Replace http://127.0.0.1:8000/ with host once deployed
  const response = await fetch("http://127.0.0.1:8000/api/walk/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": true,
    },
    body: JSON.stringify({
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
  // let keyboard = useRef();
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
    let pois = await createWalk(getAllMessages());
    console.log("Created walk with pois:", pois);
    setRouteObjects(pois);
    router.push("/start-your-tour/route");
  }

  function logContext() {
    console.log("Context from gpt:", getAllMessages());
  }

  const onChange = (input) => {
    console.log("Input changed", input);
  };

  const onKeyPress = (button) => {
    console.log("Button pressed", button);
  };
  if (hasFinishedChatting) {
    document.querySelector(".react-chatbot-kit-chat-input").disabled = true;
    document.querySelector(".react-chatbot-kit-chat-btn-send").disabled = true;
  }
  // else if(document !== undefined){
  //   document.querySelector('.react-chatbot-kit-chat-input').disabled = false;
  //   document.querySelector('.react-chatbot-kit-chat-btn-send').disabled = false;
  // }
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
            <RobotImage src="/jos.png" width={250} height={250} alt="Robot Image" />
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
              {/* Change to true to test logging context */}
              {false && <button onClick={logContext}>Log context</button>}
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
        {/* <Keyboard
        keyboardRef={r => (keyboard = r)}
        // layoutName={state.layoutName}
        onChange={onChange}
        onKeyPress={onKeyPress}
      /> */}
      </CenteredPageContainer>
    </div>
  );
}
