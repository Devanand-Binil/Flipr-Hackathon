import React from 'react';
import { useSelector } from 'react-redux';
import {
  DotsIcon,
  SearchLargeIcon,
  CallIcon,
  VideoCallIcon
} from '../../../svg';
import { capitalize } from '../../../utils/string';
import { getConversationName, getConversationPicture } from '../../../utils/chat';
import SocketContext from "../../../context/SocketContext";

const ChatHeader = ({ online, callUser, socket }) => {
  const { activeConversation } = useSelector((state) => state.chat);
  console.log("Active conversation in ChatHeader:", activeConversation);
  console.log("Users in activeConversation:", activeConversation.users);
  const { user } = useSelector((state) => state.user);
  console.log("User in ChatHeader:", user);
  if (!activeConversation || !user) return null; // or show a loading state

  return (
    <div className="h-[59px] dark:bg-dark_bg_4 border-b flex items-center p-4 select-none">
      <div className="w-full flex items-center justify-between">
        {/* Left side */}
        {activeConversation ? (
  <div className="flex items-center gap-x-4">
    <button className="btn hover:bg-dark_hover_1 focus:outline-none">
      <img
        src={
          activeConversation.isGroup
            ? activeConversation.picture
            : getConversationPicture(user, activeConversation.users)
        }
        alt="Conversation"
        className="w-full h-full rounded-full object-cover"
      />
    </button>
    <div className="flex flex-col">
      <h1 className="dark:text-white text-md font-bold">
        {activeConversation.isGroup
          ? activeConversation.name
          : capitalize(getConversationName(user, activeConversation.users).split(" ")[0])}
      </h1>
      <span className="text-xs dark:text-dark_svg_2">
        {online ? "online" : ""}
      </span>
    </div>
  </div>
) : (
  <div className="text-white">No conversation selected</div>
)}


        {/* Right side */}
        <ul className="flex items-center gap-x-2.5">
<<<<<<< HEAD
          {/* <li onClick={() => callUser()}>
=======
          {/*<li onClick={() => callUser()}>
>>>>>>> da3314b7321c6c74fc800426cd1c69e05ea4b165
            <button className="btn hover:bg-dark_hover_1 focus:outline-none">
              <VideoCallIcon />
            </button>
          </li>
          <li>
            <button className="btn hover:bg-dark_hover_1 focus:outline-none">
              <CallIcon />
            </button>
<<<<<<< HEAD
          </li> */}
          {/* <li>
=======
          </li>
          */}
          <li>
>>>>>>> da3314b7321c6c74fc800426cd1c69e05ea4b165
            <button className="btn hover:bg-dark_hover_1 focus:outline-none">
              <SearchLargeIcon className="dark:fill-dark_svg_1" />
            </button>
          </li>
          <li>
            <button className="btn hover:bg-dark_hover_1 focus:outline-none">
              <DotsIcon className="dark:fill-dark_svg_1" />
            </button>
          </li> */}
        </ul>
      </div>
    </div>
  );
};

const ChatHeaderWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <ChatHeader {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ChatHeaderWithSocket;
