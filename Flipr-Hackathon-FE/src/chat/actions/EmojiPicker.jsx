import React, { useEffect, useState } from "react";
import { CloseIcon, EmojiIcon } from "../../../svg";
import EmojiPicker from "emoji-picker-react";

const EmojiPickerApp = ({
  textRef,
  message,
  setMessage,
  showPicker,
  setShowPicker,
  setShowAttachments,
}) => {
  const [cursorPosition, setCursorPosition] = useState();

  useEffect(() => {
    if (textRef.current) {
      textRef.current.selectionEnd = cursorPosition;
    }
  }, [cursorPosition]);

  const handleEmoji = (emojiData) => {
    const { emoji } = emojiData;
    const ref = textRef.current;
    ref.focus();
    const start = message.substring(0, ref.selectionStart);
    const end = message.substring(ref.selectionStart);
    const newText = start + emoji + end;
    setMessage(newText);
    setCursorPosition(start.length + emoji.length);
  };

  return (
    <li>
      <button
        className="bg-[#FFBF00] hover:bg-yellow-400 text-white rounded-full p-2 transition duration-200 ease-in-out shadow-md"
        type="button"
        onClick={() => {
          setShowAttachments(false);
          setShowPicker((prev) => !prev);
        }}
      >
        {showPicker ? (
          <CloseIcon className="w-5 h-5 dark:fill-dark_svg_1" />
        ) : (
          <EmojiIcon className="w-5 h-5 dark:fill-dark_svg_1" />
        )}
      </button>

      {showPicker && (
        <div className="absolute bottom-[64px] left-0 w-[300px] z-30 openEmojiAnimation drop-shadow-lg">
          <EmojiPicker
            theme="dark"
            onEmojiClick={handleEmoji}
            emojiStyle="native"
            searchDisabled={false}
          />
        </div>
      )}
    </li>
  );
};

export default EmojiPickerApp;
