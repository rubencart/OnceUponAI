import React from "react";

let first_question = true;

// TODO: Change amount or implementation when we decide the conversation
let messageCount = 0;
let maxMessagesCount = 3;

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
		
    // actions.handleLastMessage();
    if (first_question) {
      actions.handleName(message);
      first_question = false;
    } else if (messageCount == maxMessagesCount) {
			actions.handleLastMessage();
    } else {
      messageCount++;
      // Otherwise pass the message to get our GPT response
      actions.handleGPT(message, messageCount);
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions: {},
        });
      })}
    </div>
  );
};

export default MessageParser;
