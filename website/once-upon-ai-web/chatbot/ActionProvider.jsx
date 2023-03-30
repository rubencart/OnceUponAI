import React from "react";

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const addResponse = (botMessage) => {
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleHello = () => {
    const botMessage = createChatBotMessage("Hello. Nice to meet you.");
    addResponse(botMessage);
  };

  const handleGPT = (message) => {
    // TODO: Get GPT response
    const response = `Contacting GPT for "${message}"`;
    const botMessage = createChatBotMessage(response);
    addResponse(botMessage);
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: { handleHello, handleGPT },
        });
      })}
    </div>
  );
};

export default ActionProvider;
