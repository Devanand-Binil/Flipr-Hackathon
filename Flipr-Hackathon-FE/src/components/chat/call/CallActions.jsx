import { useState } from "react";
import {
  ArrowIcon,
  DialIcon,
  MuteIcon,
  SpeakerIcon,
  VideoDialIcon,
} from "../../../svg";

export default function CallActions({ endCall }) {
  const [expanded, setExpanded] = useState(true);
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [videoOn, setVideoOn] = useState(true);

  return (
    <div className="w-full absolute bottom-0 z-40 px-1 transition-all">
      <div
        className={`relative bg-[#222] px-4 pt-6 pb-12 rounded-xl transition-all duration-300 ${
          expanded ? "h-[120px]" : "h-[40px]"
        }`}
      >
        {/* Expand/Collapse */}
        <button
          type="button"
          aria-label="Toggle call actions"
          className={`absolute top-1 left-1/2 transform -translate-x-1/2 transition-transform ${
            expanded ? "-rotate-90" : "rotate-90"
          }`}
          onClick={() => setExpanded(!expanded)}
        >
          <ArrowIcon className="fill-dark_svg_2 scale-y-[300%]" />
        </button>

        {/* Actions */}
        {expanded && (
          <ul className="flex items-center justify-between">
            <li>
              <button
                type="button"
                onClick={() => setSpeakerOn(!speakerOn)}
                className={`btn_secondary ${speakerOn ? "bg-green-600" : ""}`}
                aria-label="Toggle speaker"
              >
                <SpeakerIcon className="fill-white w-6" />
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setVideoOn(!videoOn)}
                className={`btn_secondary ${!videoOn ? "bg-yellow-500" : ""}`}
                aria-label="Toggle video"
              >
                <VideoDialIcon className="fill-white w-14 mt-2.5" />
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setMuted(!muted)}
                className={`btn_secondary ${muted ? "bg-gray-600" : ""}`}
                aria-label="Toggle mute"
              >
                <MuteIcon className="fill-white w-5" />
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={endCall}
                className="btn_secondary bg-red-600 rotate-[135deg]"
                aria-label="End call"
              >
                <DialIcon className="fill-white w-6" />
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
