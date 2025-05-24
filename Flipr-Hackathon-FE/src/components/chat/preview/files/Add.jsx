import { useRef } from "react";
import { useDispatch } from "react-redux";
import { CloseIcon } from "../../../../svg";
import { addFiles } from "../../../../features/chatSlice";
import { getFileType } from "../../../../utils/file";

export default function Add() {
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const fileHandler = (e) => {
    let files = Array.from(e.target.files);

    files.forEach((file) => {
      const isSupported =
        [
          "application/pdf",
          "text/plain",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.rar",
          "application/zip",
          "audio/mpeg",
          "audio/wav",
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/webp",
          "video/mp4",
          "video/mpeg",
          "image/webm",
        ].includes(file.type);

      const isSizeValid = file.size <= 1024 * 1024 * 10;

      if (isSupported && isSizeValid) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          dispatch(
            addFiles({
              file,
              fileData: getFileType(file.type) === "IMAGE" ? e.target.result : "",
              type: getFileType(file.type),
            })
          );
        };
      }
    });
  };

  return (
    <>
      <div
        onClick={() => inputRef.current.click()}
        className="w-14 h-14 mt-2 border dark:border-white rounded-md flex items-center justify-center cursor-pointer"
      >
        <span className="rotate-45">
          <CloseIcon className="dark:fill-dark_svg_1" />
        </span>
      </div>
      <input
        type="file"
        hidden
        multiple
        ref={inputRef}
        onChange={fileHandler}
        accept="application/*,text/plain,image/png,image/jpeg,image/gif,image/webp,video/mp4,video/mpeg"
      />
    </>
  );
}
