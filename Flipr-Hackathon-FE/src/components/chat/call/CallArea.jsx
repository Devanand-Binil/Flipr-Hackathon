import { capitalize } from "../../../utils/string";
import CallTimes from "./CallTimes";

export default function CallArea({
  name,
  totalSecInCall,
  setTotalSecInCall,
  callAccepted,
}) {
  const capitalizedUser = name ? capitalize(name.trim()) : "Unknown";

  return (
    <div className="absolute top-12 z-40 w-full px-4">
      <div className="flex flex-col items-center text-center space-y-2">
        {/* User name */}
        <h1 className="text-white text-lg font-bold" aria-label="Call user name">
          {capitalizedUser}
        </h1>

        {/* Call status or timer */}
        {totalSecInCall === 0 && !callAccepted ? (
          <span className="text-dark_text_1 text-sm">Ringing...</span>
        ) : (
          <CallTimes
            totalSecInCall={totalSecInCall}
            setTotalSecInCall={setTotalSecInCall}
            callAccepted={callAccepted}
          />
        )}
      </div>
    </div>
  );
}
