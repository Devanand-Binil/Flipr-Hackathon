import { useSelector } from "react-redux";

// Preload all icons
const fileIcons = import.meta.glob('../../../../images/file/*.png', {
  eager: true,
  import: 'default',
});

export default function FileViewer({ activeIndex, setActiveIndex }) {
  const { files } = useSelector((state) => state.chat);
  const file = files[activeIndex];
  const type = file?.type;
  const imageSrc = fileIcons[`../../../../images/file/${type}.png`];

  return (
    <div className="w-full max-w-[60%]">
      <div className="flex justify-center items-center">
        {type === "IMAGE" ? (
          <img
            src={file.fileData}
            alt=""
            className="max-w-[80%] object-contain hview rounded-md"
          />
        ) : type === "VIDEO" ? (
          <video
            src={file.fileData}
            controls
            className="max-w-[80%] object-contain hview rounded-md"
          />
        ) : (
          <div className="min-w-full hview flex flex-col items-center justify-center gap-4">
            <img
              src={imageSrc}
              alt={type}
              className="w-20 h-20"
            />
            <h1 className="text-2xl dark:text-dark_text_2 font-semibold">
              No preview available
            </h1>
            <span className="text-sm dark:text-dark_text_2">
              {file?.file?.size} kB - {type}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
