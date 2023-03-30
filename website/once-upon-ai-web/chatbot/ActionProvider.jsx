import React from "react";

async function sendMessageToGPT3(prompt) {
  try {
    const response = await fetch("/api/gpt3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
    });

    if (response.ok) {
      const data = await response.json();
      const generatedMessage = data.message;
      console.log("Generated message:", generatedMessage);
      return generatedMessage;
    } else {
      console.error("Error:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

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

  const handleGPT = async (message) => {
    // TODO: Get GPT response
    const response = await sendMessageToGPT3(message);
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
