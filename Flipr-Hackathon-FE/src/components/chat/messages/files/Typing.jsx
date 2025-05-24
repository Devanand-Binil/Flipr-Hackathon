import { BeatLoader } from "react-spinners";
import TraingleIcon from "../../../svg/triangle";

export default function Typing() {
  return (
    <div className="w-full flex mt-2 max-w-xs">
      {/* Typing Indicator Container */}
      <div className="relative flex items-end gap-x-2">
        <div className="relative p-2 rounded-lg dark:bg-dark_bg_2">
          {/* Typing Dots Animation */}
          <BeatLoader color="#fff" size={10} />

          {/* Tail Triangle */}
          <span>
            <TraingleIcon className="dark:fill-dark_bg_2 rotate-[60deg] absolute top-[-5px] -left-1.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
