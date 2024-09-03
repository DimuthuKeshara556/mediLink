import React, { useState, useEffect } from "react";

function Clock() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const date = new Date();
      const day = date.toLocaleDateString("en-US", { weekday: "short" });
      const month = date.toLocaleDateString("en-US", { month: "short" });
      const dayNum = date.getDate();
      const year = date.getFullYear();
      const time = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }); // "09:07 AM"

      setCurrentTime(`${day} ${month} ${dayNum} ${year} ${time}`);
    };

    const intervalId = setInterval(updateClock, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <p className="text-[14px] font-medium">{currentTime}</p>
    </div>
  );
}

export default Clock;
