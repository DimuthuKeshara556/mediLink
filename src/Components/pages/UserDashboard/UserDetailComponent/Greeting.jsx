import React, { useState, useEffect } from "react";

const Greeting = () => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const updateGreeting = () => {
      const hours = new Date().getHours();
      if (hours < 12) {
        setGreeting("Good Morning");
      } else if (hours < 18) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }
    };

    updateGreeting();

    const interval = setInterval(updateGreeting, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="greeting">
      <h1>{greeting}</h1>
    </div>
  );
};

export default Greeting;
