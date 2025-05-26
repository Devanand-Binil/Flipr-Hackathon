import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import SocketContext from "../../../context/SocketContext";

function Input({ message, setMessage, textRef, socket }) {
  const { activeConversation } = useSelector((state) => state.chat);
  const [typing, setTyping] = useState(false);
  const lastTypingTime = useRef(null);
  const typingTimeout = useRef(null);

  const onChangeHandler = (e) => {
    const value = e.target.value;
    setMessage(value);

    if (!typing) {
      setTyping(true);
      socket.emit("typing", activeConversation._id);
    }

    lastTypingTime.current = new Date().getTime();

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime.current;
      if (timeDiff >= 1000 && typing) {
        socket.emit("stop typing", activeConversation._id);
        setTyping(false);
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, []);

  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Type a message"
        className="dark:bg-dark_bg_1 dark:text-dark_text_1 bg-white text-white rounded-full h-[45px] w-full px-4 shadow-sm outline-none transition duration-200 focus:ring-2 focus:ring-[#153713] placeholder:text-gray-300"
        value={message}
        onChange={onChangeHandler}
        ref={textRef}
      />
    </div>
  );
}

const InputWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Input {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default InputWithSocket;
