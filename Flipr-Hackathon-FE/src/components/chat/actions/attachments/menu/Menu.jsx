import {
  CameraIcon,
  ContactIcon,
  DocumentIcon,
  PollIcon,
  StickerIcon,
} from "../../../../../svg";
import DocumentAttachment from "./DocumentAttachment";
import PhotoAttachment from "./PhotoAttachment";

export default function Menu() {
  const menuItems = [
    {
      icon: <PollIcon className="w-6 h-6 text-white" />,
      tooltip: "Create Poll",
      bg: "from-blue-400 to-indigo-600",
    },
    {
      icon: <ContactIcon className="w-6 h-6 text-white" />,
      tooltip: "Share Contact",
      bg: "from-cyan-400 to-sky-500",
    },
    {
      icon: <CameraIcon className="w-6 h-6 text-white" />,
      tooltip: "Open Camera",
      bg: "from-pink-500 to-red-500",
    },
    {
      icon: <StickerIcon className="w-6 h-6 text-white" />,
      tooltip: "Send Sticker",
      bg: "from-green-400 to-emerald-500",
    },
  ];

  return (
    <ul className="absolute bottom-16 flex flex-col gap-3 openEmojiAnimation z-50">
      {menuItems.map((item, index) => (
        <li key={index} className="relative group flex items-center">
          <button
            type="button"
            className={`bg-gradient-to-tr ${item.bg} p-3 rounded-full shadow-md hover:scale-110 transition-transform duration-200 ease-in-out`}
          >
            {item.icon}
          </button>
          <span className="absolute left-full ml-3 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {item.tooltip}
          </span>
        </li>
      ))}

      <DocumentAttachment />
      <PhotoAttachment />
    </ul>
  );
}
