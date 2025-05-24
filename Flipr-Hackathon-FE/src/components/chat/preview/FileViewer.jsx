import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function FileViewer({ activeIndex, setActiveIndex }) {
  const { files } = useSelector((state) => state.chat);

  return (
    <div className="w-full max-w-[60%]">
      {/*Container*/}
      <div className="flex justify-center items-center">
        {files[activeIndex].type === "IMAGE" ? (
          <img
            src={files[activeIndex].fileData}
            alt=""
            className="max-w-[80%] object-contain hview rounded-md"
          />
        ) : files[activeIndex].type === "VIDEO" ? (
          <video
            src={files[activeIndex].fileData}
            controls
            className="max-w-[80%] object-contain hview rounded-md"
          ></video>
        ) : (
          <div className="min-w-full hview flex flex-col items-center justify-center gap-4">
            {/* File Icon Image */}
            <img
              src={require(`../../../../images/file/${files[activeIndex].type}.png`)}
              alt={files[activeIndex].type}
              className="w-20 h-20"
            />
            {/* No preview text */}
            <h1 className="text-2xl dark:text-dark_text_2 font-semibold">
              No preview available
            </h1>
            {/* File size / type */}
            <span className="text-sm dark:text-dark_text_2">
              {files[activeIndex]?.file?.size} kB - {files[activeIndex]?.type}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
