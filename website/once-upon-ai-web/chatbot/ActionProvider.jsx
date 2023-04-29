import React from "react";

let allMessages = [];
let conversation = [];
let questions = [
  "the joy of living in the city of Ghent.",
  "different topics that the user may like about Ghent.",
  "the users favorite place in Ghent.",
  "about the lifestyle of the user.",
  "about one of the previous answers of the user.",
]


function getAllMessages() {
  return conversation;
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
      body: JSON.stringify({ prompt: prompt  }),
    });

    if (response.ok) {
      const data = await response.json();
      const generatedMessage = data.message;
      allMessages = data.allMessages;
      // console.log("Generated message:", generatedMessage);
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

  const handleName = async (message) => {
    // const botMessage = createChatBotMessage("Hallo " + message + "! Fijn je te ontmoeten! Met de volgende vragen gaan we een route speciaal voor jouw maken! Wat is je favoriete kleur?");
    // addResponse(botMessage);
		message = 'Use max 25 words to greet the user with the name '+ message + '. Propose to do a city tour and ask about the users interests. Keep writing in Dutch.';
		console.log("Message:", message);
    const response = await sendMessageToChatbot(message);
    console.log("Response:", response);
    conversation.push(response);
    conversation.push(message);
    const botMessage = createChatBotMessage(response);
    addResponse(botMessage);
  };

  const handleGPT = async (message, questionNumber) => {
    // console.log('questionNumber' + questionNumber)
    conversation.push(message);
    message += "Respond briefly but enthousiast to " + message + ", which is an answer to " + questions[questionNumber-1] ;
    message += "Ask a question about " + questions[questionNumber];
		message += "\n Use a maximum of 30 words. You already greeted the user. Don't write a welcome to Ghent message. Answer in Dutch."
    console.log("Message:", message);
    const response = await sendMessageToChatbot(message);
    console.log("Response:", response);
    const botMessage = createChatBotMessage(response);
    addResponse(botMessage);
    
    conversation.push(response);
    
  };

  const handleLastMessage = async () => {
    let message = "Thank the user and say something that you will make the generated route now."
    message += "\n Use a maximum of 30 words. Don't ask any more questions."
    console.log("Message:", message);
    const response = await sendMessageToChatbot(message);
    console.log("Response:", response);
    const botMessage = createChatBotMessage(
      response,
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
