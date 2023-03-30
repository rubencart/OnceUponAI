import { createChatBotMessage } from "react-chatbot-kit";

const chatbotConfig = {
  botName: "GentGPT",
  initialMessages: [createChatBotMessage(`Hello world`)],
};

export default chatbotConfig;
