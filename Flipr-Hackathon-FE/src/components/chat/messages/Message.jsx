import moment from "moment";
import TraingleIcon from "../../../svg/triangle";

const Message = ({ message, me }) => {
  const isGroupMessage = !me && message.conversation.isGroup;

  return (
    <div
      className={`w-full flex mt-2 max-w-xs ${me ? "ml-auto justify-end" : ""}`}
    >
      {/* Message Container */}
      <div className="relative flex items-end gap-x-2">
        {/* Sender Avatar */}
        {isGroupMessage && (
          <img
            src={message.sender.picture}
            alt="sender"
            className="w-8 h-8 rounded-full"
          />
        )}

        {/* Message Bubble */}
        <div
          className={`relative p-2 rounded-lg text-sm leading-relaxed ${
            me ? "bg-green_3 text-white" : "dark:bg-dark_bg_1 dark:text-dark_text_1"
          }`}
        >
          {/* Message Text */}
          <p className="pr-10">{message.message}</p>

          {/* Timestamp */}
          <span className="absolute right-2 bottom-1 text-[11px] text-dark_text_5">
            {moment(message.createdAt).format("HH:mm")}
          </span>

          {/* Tail Bubble Triangle */}
          <span>
            <TraingleIcon
              className={`rotate-[60deg] absolute top-[-5px] ${
                me
                  ? "fill-green_3 -right-2"
                  : "dark:fill-dark_bg_1 -left-1.5"
              }`}
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Message;
