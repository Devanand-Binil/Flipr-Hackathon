import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { open_create_conversations } from '../../../features/chatSlice';
import SocketContext from "../../../context/SocketContext";

function Contact({ contact, setSearchResults, socket }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { token } = user;

  const values = {
    receiver_id: contact._id,
    token,
  };

  const openConversation = async () => {
    let newConvo = await dispatch(open_create_conversations(values));
    socket.emit('join conversation', newConvo.payload._id);
    setSearchResults([]);
  };

  return (
    <li
      onClick={openConversation}
      className="list-none px-4 py-3 hover:bg-[#1f1f1f] dark:hover:bg-dark_bg_2 rounded-lg cursor-pointer transition-all duration-200"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-700 shadow-sm">
          <img
            src={contact.picture}
            alt={contact.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name and Status */}
        <div className="flex flex-col overflow-hidden">
          <h1 className="font-semibold text-[15px] truncate dark:text-dark_text_1">
            {contact.name}
          </h1>
          <p className="text-sm text-gray-400 truncate">
            {contact.status || "No status available"}
          </p>
        </div>
      </div>

      <div className="ml-16 mt-3 border-b border-dark_border_1 opacity-50"></div>
    </li>
  );
}

const ContactWithContext = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Contact {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ContactWithContext;
