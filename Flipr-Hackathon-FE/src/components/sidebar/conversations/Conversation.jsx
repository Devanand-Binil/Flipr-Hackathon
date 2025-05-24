import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { open_create_conversations } from "../../../features/chatSlice";
import {
  getConversationId,
  getConversationName,
  getConversationPicture,
  checkOnlineStatus,
} from "../../../utils/chat";
import { dateHandler } from "../../../utils/date";
import { capitalize } from "../../../utils/string";
import SocketContext from "../../../context/SocketContext";

function Conversation({ convo, socket, online, typing }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { activeConversation } = useSelector((state) => state.chat);
  const token = user?.token;

  const values = {
    receiver_id: getConversationId(user, convo.users),
    isGroup: convo.isGroup ? convo._id : false,
    token,
  };

  const openConversation = async () => {
    try {
      const newConvo = await dispatch(open_create_conversations(values));
      if (newConvo?.payload?._id) {
        socket.emit("join conversation", newConvo.payload._id);
      }
    } catch (err) {
      console.error("Error opening conversation:", err);
    }
  };

  const isActive = convo?._id === activeConversation?._id;
  const latestMsg = convo?.latestMessage?.message || "";

  return (
    <li
      onClick={openConversation}
      className={`list-none w-full px-4 py-3 rounded-2xl transition-colors duration-200
        ${isActive ? "bg-dark_hover_1" : "hover:bg-dark_bg_2"}
        dark:text-dark_text_1 cursor-pointer`}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className={`relative w-12 h-12 rounded-full overflow-hidden ${
            online ? "online" : ""
          }`}
        >
          <img
            src={
              convo?.isGroup
                ? convo.picture
                : getConversationPicture(user, convo?.users)
            }
            alt={convo?.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-base truncate">
              {convo?.isGroup
                ? convo?.name
                : capitalize(getConversationName(user, convo?.users))}
            </h1>
            <span className="text-xs text-gray-400">
              {convo?.latestMessage?.createdAt
                ? dateHandler(convo.latestMessage.createdAt)
                : ""}
            </span>
          </div>

          <div className="text-sm text-gray-400 mt-1 truncate">
            {typing === convo?._id ? (
              <span className="text-green_1">Typing...</span>
            ) : latestMsg.length > 25 ? (
              `${latestMsg.substring(0, 25)}...`
            ) : (
              latestMsg
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

const ConversationWithContext = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Conversation {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ConversationWithContext;
