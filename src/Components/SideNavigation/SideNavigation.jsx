import inboxIcon from "../../assets/Icons/inbox.svg";
import historyIcon from "../../assets/Icons/history-black.svg";
import historyIconBlue from "../../assets/Icons/history-blue.svg";
import doctorIcon from "../../assets/Icons/doctor.svg";
import doctorIconBlue from "../../assets/Icons/doctor-blue.svg";
import appointmentIcon from "../../assets/Icons/appointments.svg";
import appointmentIconBlue from "../../assets/Icons/appointment-blue.png";
import settingsIcon from "../../assets/Icons/settings-black.svg";
import settingsIconBlue from "../../assets/Icons/settings-blue.svg";
import homeIconBlack from "../../assets/Icons/home-black.svg";
import homeIcon from "../../assets/Icons/home.svg";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const SideNavigatione = () => {
  const [selected, setSelected] = useState("home");

  const navItems = [
    {
      name: "Home",
      path: "/patient/application",
      image: homeIconBlack,
      image2: homeIcon,
    },
    {
      name: "Appointment",
      path: "/patient/appointment",
      image: appointmentIcon,
      image2: appointmentIconBlue,
    },

    {
      name: "History",
      path: "/patient/history",
      image: historyIcon,
      image2: historyIconBlue,
    },
    {
      name: "Doctors",
      path: "/patient/doctorlist",
      image: doctorIcon,
      image2: doctorIconBlue,
    },
    {
      name: "Settings",
      path: "/patient/edit",
      image: settingsIcon,
      image2: settingsIconBlue,
    },
  ];
  return (
    <div className="w-full h-fit flex-row fixed bottom-0 md:w-1/6 md:h-screen border-r-2 border-accent p-5 md:flex md:flex-col md:pt-20  md:fixed bg-white">
      <nav className="flex flex-row md:flex-col items-center justify-around md:items-start md:justify-start">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={`p-2 hover:scale-105  ${
              selected === item.name.toLowerCase() ? "text-blue-500" : ""
            }`}
            onClick={() => setSelected(item.name.toLowerCase())}
          >
            <div className="flex flex-col md:flex-row items-center  gap-2 md:gap-5">
              <img
                className="w-[17px]"
                src={
                  selected === item.name.toLowerCase()
                    ? item.image2
                    : item.image
                }
                alt="icon"
              />
              <p className="text-[12px] md:text-[16px] font-medium">
                {item.name}
              </p>
            </div>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default SideNavigatione;
