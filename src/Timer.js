import React from "react";

const Timer = ({ time, text, side }) => {
  return (
    <div
      className={`timer element ${side} w-36 h-36 flex flex-col justify-around items-center lg:py-8 md:py-6 sm:py-4 py-2`}
    >
      <div className="timediv">{text}</div>
      <div className="curtime">{time}</div>
    </div>
  );
};

export default Timer;
