import { useDispatch, useSelector } from "react-redux";
import { CloseIcon } from "../../../../svg";
import { clearFiles } from "../../../../features/chatSlice";

export default function Header({ activeIndex }) {
  const dispatch = useDispatch();
  const { files } = useSelector((state) => state.chat);

  const clearFilesHandler = () => {
    dispatch(clearFiles());
  };

  return (
    <div className="w-full">
      {/* Container */}
      <div className="w-full flex items-center justify-between px-4 py-2 border-b dark:border-dark_border_2">
        {/* Close Icon */}
        <div
          className="cursor-pointer"
          onClick={clearFilesHandler}
          title="Clear all files"
        >
          <CloseIcon className="dark:fill-dark_svg_1 w-6 h-6" />
        </div>

        {/* File Name */}
        <h1 className="text-sm dark:text-dark_text_1 truncate max-w-[70%] text-center">
          {files[activeIndex]?.file?.name || "No file selected"}
        </h1>

        {/* Empty span for layout balance */}
        <span className="w-6 h-6"></span>
      </div>
    </div>
  );
}
