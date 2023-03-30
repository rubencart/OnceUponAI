import { createChatBotMessage } from "react-chatbot-kit";

const init_message = "Hey! Mijn naam is Jos ik ben je gids voor vandaag, hoe heet jij?"

const chatbotConfig = {
  botName: "GentGPT",
  initialMessages: [createChatBotMessage(init_message)],
};

export default chatbotConfig;
