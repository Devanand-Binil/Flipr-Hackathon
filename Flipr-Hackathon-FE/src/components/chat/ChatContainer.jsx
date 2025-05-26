import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatHeader from "./header/ChatHeader";
import ChatMessages from "./messages/chatMessages";
import ChatActions from "./actions/ChatActions";
import FilesPreview from "./preview/files/FilesPreview";
import { getConversationMessages } from "../../features/chatSlice";
import { checkOnlineStatus } from "../../utils/chat";

export default function ChatContainer({ onlineUsers, typing, callUser }) {
  const dispatch = useDispatch();
  const { activeConversation, files } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const { token } = user;

  useEffect(() => {
    if (activeConversation?._id) {
      const values = {
        token,
        convo_id: activeConversation._id,
      };
      dispatch(getConversationMessages(values));
    }
  }, [activeConversation]);

  return (
    <div className="relative w-full h-full border-l bg-[#283618] dark:border-l-dark_border_2 select-none overflow-hidden">
      <ChatHeader
        online={checkOnlineStatus(
          onlineUsers,
          user,
          activeConversation?.users
        )}
        callUser={callUser}
      />
      {files.length > 0 ? (
        <FilesPreview />
      ) : (
        <>
          <ChatMessages typing={typing} />
          <ChatActions />
        </>
      )}
    </div>
  );
}
