import { useEffect } from "react";

export default function CallTimes({
  totalSecInCall,
  setTotalSecInCall,
  callAccepted,
}) {
  useEffect(() => {
    let timer;
    if (callAccepted) {
      const tick = () => {
        setTotalSecInCall((prev) => prev + 1);
        timer = setTimeout(tick, 1000);
      };
      tick();
    }
    return () => {
      clearTimeout(timer);
      setTotalSecInCall(0);
    };
  }, [callAccepted, setTotalSecInCall]);

  if (totalSecInCall === 0) return null;

  // Calculate hours, minutes, seconds
  const hours = Math.floor(totalSecInCall / 3600);
  const minutes = Math.floor((totalSecInCall % 3600) / 60);
  const seconds = totalSecInCall % 60;

  // Helper to format time with leading zero
  const formatTime = (unit) => (unit < 10 ? `0${unit}` : unit);

  return (
    <div className="text-dark_text_2">
      {hours > 0 && (
        <>
          <span>{formatTime(hours)}</span>
          <span>:</span>
        </>
      )}
      <span>{formatTime(minutes)}</span>
      <span>:</span>
      <span>{formatTime(seconds)}</span>
    </div>
  );
}
