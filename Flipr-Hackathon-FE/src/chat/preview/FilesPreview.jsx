import { useState } from "react";
import FileViewer from "./FileViewer";
import HandleAndSend from "./HandleAndSend";
import Header from "./Header";
import Input from "./Input";

export default function FilesPreview() {
  const [message, setMessage] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative w-full py-2 flex items-center justify-center bg-dark_bg_1">
      {/* Container */}
      <div className="w-full max-w-4xl flex flex-col items-center space-y-4">
        {/* Header */}
        <Header activeIndex={activeIndex} />

        {/* Viewing selected file */}
        <FileViewer activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

        {/* Message and send section */}
        <div className="w-full flex flex-col items-center space-y-2">
          {/* Message Input */}
          <Input message={message} setMessage={setMessage} />

          {/* Send and manipulate files */}
          <HandleAndSend
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            message={message}
          />
        </div>
      </div>
    </div>
  );
}
