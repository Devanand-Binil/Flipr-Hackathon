import { useRef } from "react";
import { PhotoIcon } from "../../../../../svg";
import { useDispatch } from "react-redux";
import { addFiles } from "../../../../../features/chatSlice";
import { getFileType } from "../../../../../utils/file";

export default function PhotoAttachment() {
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const imageHandler = (e) => {
    let files = Array.from(e.target.files);
    files.forEach((file) => {
      if (
        file.type !== "image/png" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/gif" &&
        file.type !== "image/webp" &&
        file.type !== "video/mp4" &&
        file.type !== "video/mpeg" &&
        file.type !== "image/webm"
      ) {
        files = files.filter((item) => item.name !== file.name);
        return;
      } else if (file.size > 1024 * 1024 * 10) {
        files = files.filter((item) => item.name !== file.name);
        return;
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          dispatch(
            addFiles({
              file: file,
              fileData: e.target.result,
              type: getFileType(file.type),
            })
          );
        };
      }
    });
  };

  return (
    <li className="relative group">
      <button
        type="button"
        className="bg-gradient-to-tr from-fuchsia-500 to-purple-600 p-3 rounded-full shadow-md hover:scale-110 transition-transform duration-200 ease-in-out"
        onClick={() => inputRef.current.click()}
      >
        <PhotoIcon className="w-6 h-6 text-white" />
      </button>

      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        Upload Photo/Video
      </div>

      <input
        type="file"
        hidden
        multiple
        ref={inputRef}
        accept="image/png,image/jpeg,image/gif,image/webp,video/mp4,video/mpeg,image/webm"
        onChange={imageHandler}
      />
    </li>
  );
}
