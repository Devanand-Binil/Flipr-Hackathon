import React from "react";
import Conversation from "./Conversation";
import { useSelector } from "react-redux";
import { checkOnlineStatus } from "../../../utils/chat";

const Conversations = ({ onlineUsers, typing }) => {
  const { conversations, activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);

  return (
    <div className="h-full w-full px-3 py-4 overflow-y-auto space-y-2 scrollbar">
      <ul className="flex flex-col gap-2">
        {conversations &&
          conversations
            .filter(
              (c) =>
                c.latestMessage ||
                c._id === activeConversation._id ||
                c.isGroup === true
            )
            .map((convo) => {
              const isOnline = !convo.isGroup && checkOnlineStatus(onlineUsers, user, convo.users);
              return (
                <Conversation
                  convo={convo}
                  key={convo._id}
                  online={isOnline}
                  typing={typing}
                />
              );
            })}
      </ul>
    </div>
  );
};

export default Conversations;
