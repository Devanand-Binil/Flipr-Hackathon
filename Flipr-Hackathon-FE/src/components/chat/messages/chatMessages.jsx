import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Message from "./Message";
import Typing from "./Typing";
import FileMessage from "./files/FileMessage";

const ChatMessages = ({ typing }) => {
  const { messages, activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const endRef = useRef();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="mb-[60px] bg-[url('/bg.jpg')] bg-cover bg-no-repeat">
      <div className="scrollbar overflow_scrollbar overflow-auto py-2 px-4">
        {messages &&
          messages.map((message) => (
            <React.Fragment key={message._id}>
              {/* Files */}
              {message.files.length > 0 &&
                message.files.map((file) => (
                  <FileMessage
                    FileMessage={file}
                    message={message}
                    key={file._id}
                    me={user._id === message.sender._id}
                  />
                ))}
              {/* Text message */}
              {message.message.length > 0 && (
                <Message
                  message={message}
                  me={user._id === message.sender._id}
                />
              )}
            </React.Fragment>
          ))}
        {typing === activeConversation._id && <Typing />}
        <div ref={endRef} className="mb-2" />
      </div>
    </div>
  );
};

export default ChatMessages;
