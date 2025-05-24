import { useState } from "react";
import CallActions from "./CallActions";
import CallArea from "./CallArea";
import Header from "./Header";
import Ringing from "./Ringing";

export default function Call({
  call,
  setCall,
  callAccepted,
  myVideo,
  stream,
  userVideo,
  answerCall,
  show,
  endCall,
  totalSecInCall,
  setTotalSecInCall,
}) {
  const { receiveingCall, callEnded, name } = call;
  const [showActions, setShowActions] = useState(false);
  const [toggle, setToggle] = useState(false);

  const isRinging = receiveingCall && !callAccepted;

  return (
    <>
      {/* Call Container */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[550px] z-10 rounded-2xl overflow-hidden callbg ${
          isRinging ? "hidden" : ""
        }`}
        onMouseOver={() => setShowActions(true)}
        onMouseOut={() => setShowActions(false)}
      >
        {/* Header */}
        <Header />

        {/* Call Area */}
        <CallArea
          name={name}
          totalSecInCall={totalSecInCall}
          setTotalSecInCall={setTotalSecInCall}
          callAccepted={callAccepted}
        />

        {/* Call Actions */}
        {showActions && <CallActions endCall={endCall} />}

        {/* Video Streams */}
        <div>
          {/* Receiver's Video */}
          {callAccepted && !callEnded && (
            <video
              ref={userVideo}
              playsInline
              muted
              autoPlay
              className={toggle ? "SmallVideoCall" : "largeVideoCall"}
              onClick={() => setToggle((prev) => !prev)}
            />
          )}

          {/* My Video */}
          {stream && (
            <video
              ref={myVideo}
              playsInline
              muted
              autoPlay
              className={`${toggle ? "largeVideoCall" : "SmallVideoCall"} ${
                showActions ? "moveVideoCall" : ""
              }`}
              onClick={() => setToggle((prev) => !prev)}
            />
          )}
        </div>
      </div>

      {/* Ringing UI */}
      {isRinging && (
        <Ringing
          call={call}
          setCall={setCall}
          answerCall={answerCall}
          endCall={endCall}
        />
      )}

      {/* Outgoing Call Ringtone */}
      {!callAccepted && show && (
        <audio src="../../../../audio/ringing.mp3" autoPlay loop />
      )}
    </>
  );
}
