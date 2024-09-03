import homeIcon from "../../../../assets/Icons/home.svg";
import historyIcon from "../../../../assets/Icons/history-black.svg";
import historyIconBlue from "../../../../assets/Icons/history-blue.svg";
import settingsIcon from "../../../../assets/Icons/settings-black.svg";
import settingsIconBlue from "../../../../assets/Icons/settings-blue.svg";
import homeIconBlack from "../../../../assets/Icons/home-black.svg";

import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const SideNavigationDoctor = () => {
  const [selected, setSelected] = useState("home");

  const navItems = [
    {
      name: "Home",
      path: "/doctor/home",
      image: homeIconBlack,
      image2: homeIcon,
    },
    {
      name: "History",
      path: "/doctor/history",
      image: historyIcon,
      image2: historyIconBlue,
    },
    {
      name: "Settings",
      path: "/doctor/settings",
      image: settingsIcon,
      image2: settingsIconBlue,
    },
  ];
  return (
    <div className="w-1/6 h-screen border-r-2 border-accent p-5 flex flex-col pt-20 fixed bg-white">
      <nav className="flex flex-col ">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={`p-2 hover:scale-105  ${
              selected === item.name.toLowerCase() ? "text-blue-500" : ""
            }`}
            onClick={() => setSelected(item.name.toLowerCase())}
          >
            <div className="flex gap-5">
              <img
                className="w-[17px]"
                src={
                  selected === item.name.toLowerCase()
                    ? item.image2
                    : item.image
                }
                alt="icon"
              />
              <p className="font-medium">{item.name}</p>
            </div>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default SideNavigationDoctor;
