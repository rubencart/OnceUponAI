import React from "react";

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    // In case we need any predefined responses
    if (message.includes("hello")) {
      actions.handleHello();
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
