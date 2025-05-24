import { useEffect, useState } from "react";
import { CloseIcon, ValidIcon } from "../../../svg";

export default function Ringing({ call, setCall, answerCall, endCall }) {
  const { receiveingCall, callEnded, name, picture } = call;
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    if (timer > 10) {
      setCall({ ...call, receiveingCall: false });
    }

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="fixed top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-lg dark:bg-dark_bg_1">
      {/* Container */}
      <div className="p-4 flex items-center justify-between gap-x-6 sm:gap-x-8">
        {/* Caller Info */}
        <div className="flex items-center gap-x-3">
          <img
            src={picture}
            alt="Caller profile"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <h1 className="text-white text-base sm:text-lg font-bold">{name}</h1>
            <span className="text-sm text-dark_text_2">WhatsApp Video...</span>
          </div>
        </div>

        {/* Call Actions */}
        <ul className="flex items-center gap-x-3">
          <li>
            <button
              aria-label="Decline Call"
              onClick={endCall}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 transition"
            >
              <CloseIcon className="fill-white w-5" />
            </button>
          </li>
          <li>
            <button
              aria-label="Accept Call"
              onClick={answerCall}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 transition"
            >
              <ValidIcon className="fill-white w-6 mt-1" />
            </button>
          </li>
        </ul>
      </div>

      {/* Ringtone */}
      <audio src="../../../../audio/ringtone.mp3" autoPlay loop />
    </div>
  );
}
