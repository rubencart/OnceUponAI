import React from "react";

let allMessages = [];

function getAllMessages() {
  return allMessages;
}
export { getAllMessages };

async function sendMessageToChatbot(prompt) {
  try {
    // const gpt3_response = await fetch("/api/gpt3", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ prompt: prompt }),
    // });

    // select which api to use
    console.log("Before response: " + prompt);
    const response = await fetch("/api/chatgpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
    });

    if (response.ok) {
      const data = await response.json();
      const generatedMessage = data.message;
      allMessages = data.allMessages;
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
    console.log("test: ", botMessage);
  };

  const handleName = (message) => {
    const botMessage = createChatBotMessage("Hallo " + message + "! Fijn je te ontmoeten! Waarmee kan ik je helpen?");
    addResponse(botMessage);
  };

  const handleGPT = async (message) => {
    console.log("Message:", message);
    const response = await sendMessageToChatbot(message);
    console.log("Response:", response);
    const botMessage = createChatBotMessage(response);
    addResponse(botMessage);
  };

  const handleLastMessage = () => {
    const botMessage = createChatBotMessage(
      "Bedankt om met me te praten, ik weet genoeg! Als je wil kan je nu je gepersonaliseerde route bekijken.",
      {
        widget: "setHasFinishedChattingTrue",
      }
    );
    addResponse(botMessage);
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: { handleName, handleGPT, handleLastMessage },
        });
      })}
    </div>
  );
};

export default ActionProvider;
