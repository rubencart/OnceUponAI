import { createChatBotMessage } from "react-chatbot-kit";

const init_message = "Hey! Mijn naam is Jos ik ben je gids voor vandaag, hoe heet jij?"

const MyAvatar = (props) => {
  return <div class="react-chatbot-kit-chat-bot-avatar-container"><p class="react-chatbot-kit-chat-bot-avatar-letter">Jos</p></div>
}
{/* <div class="react-chatbot-kit-chat-bot-avatar-container"><p class="react-chatbot-kit-chat-bot-avatar-letter">C</p></div> */}
{/* <img src="/" alt="Jos" style={{height: '50px', aspectRatio: '1/1'}}/>; */}
const CustomHeader = () => {
  return <div style="" class="react-chatbot-kit-chat-header">Conversation with Jos</div>
}
const chatbotConfig = {
  botName: "Jos",
  initialMessages: [createChatBotMessage(init_message)],
  customComponents: {     // Replaces the default header    
    header: () => <div className="react-chatbot-kit-chat-header">Conversation with Jos</div>,    // Replaces the default bot avatar    
    botAvatar: (props) => <MyAvatar {...props} />,    // Replaces the default bot chat message container    
    // botChatMessage: (props) => <MyCustomChatMessage {...props} />,    // Replaces the default user icon    
    // userAvatar: (props) => <MyCustomAvatar {...props} />,    // Replaces the default user chat message    
    // userChatMessage: (props) => <MyCustomUserChatMessage {...props} />  
  },
};

export default chatbotConfig;
