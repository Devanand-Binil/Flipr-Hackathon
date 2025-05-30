import React, { useRef, useState } from 'react';
import { SendIcon } from '../../../svg';
import Input from './Input';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../../features/chatSlice';
import { ClipLoader } from 'react-spinners';
import EmojiPickerApp from './EmojiPicker';
import { Attachments } from './attachments';
import SocketContext from '../../../context/SocketContext';

function ChatActions({ socket }) {
  const dispatch = useDispatch();
  const [showPicker, setShowPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const { activeConversation, status } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const textRef = useRef();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const values = {
    message,
    convo_id: activeConversation._id,
    files: [],
    token,
  };

  const SendMessageHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    let newMsg = await dispatch(sendMessage(values));
    socket.emit("send message", newMsg.payload);
    setMessage("");
    setLoading(false);
  };

  return (
    <form
      className="dark:bg-dark_bg_2 bg-white border-t dark:border-none h-[64px] w-full flex items-center absolute bottom-0 py-2 px-4 z-20 select-none shadow-inner"
      onSubmit={SendMessageHandler}
    >
      <div className="w-full flex items-center gap-x-2">
        <ul className="flex items-center gap-x-2">
          <EmojiPickerApp
            textRef={textRef}
            message={message}
            setMessage={setMessage}
            showPicker={showPicker}
            setShowPicker={setShowPicker}
            setShowAttachments={setShowAttachments}
          />
          <Attachments
            showAttachments={showAttachments}
            setShowAttachments={setShowAttachments}
            setShowPicker={setShowPicker}
          />
        </ul>

        <Input message={message} setMessage={setMessage} textRef={textRef} />

        <button
          type="submit"
          className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition duration-200 ease-in-out"
        >
          {status === "loading" && loading ? (
            <ClipLoader color="#E9EDEF" size={20} />
          ) : (
            <SendIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  );
}

const ChatActionsWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <ChatActions {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ChatActionsWithSocket;
