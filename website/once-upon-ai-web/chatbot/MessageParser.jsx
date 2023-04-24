import React from "react";

let first_question = true;

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    // In case we need any predefined responses
    if (first_question) {
      actions.handleName(message);
      first_question = false;
    } else {
      // Otherwise pass the message to get our GPT response
      actions.handleGPT(message);
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
