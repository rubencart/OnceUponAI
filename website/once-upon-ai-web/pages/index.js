import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Container from "../components/Container";
import Chatbot from "react-chatbot-kit";
import ActionProvider from "../chatbot/ActionProvider";
import MessageParser from "../chatbot/MessageParser";
import chatbotConfig from "../chatbot/chatbotConfig";
import styled from "@emotion/styled";

const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
`;

export default function Home() {
  return (
    <div>
      <Head>
        <title>Once Upon AI</title>
        <meta name="description" content="Homepage for Once Upon AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main>
        <Container>
          <CenterContainer>
            <h1>Once Upon AI</h1>
            <h2>Welcome!</h2>
            <Chatbot config={chatbotConfig} messageParser={MessageParser} actionProvider={ActionProvider} />
          </CenterContainer>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
