import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/Images/logo.png";
import logoSmall from "../../assets/Icons/LogoSmall.svg";
import menuImg from "../../assets/Icons/menuSvg.svg";
import { useUser } from "../UserContext/UserContext";
import Clock from "../pages/DoctorDashBoard/Clock/Clock";
import NotificationIcon from "../../assets/Icons/notification.svg";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import db from "../../Firebase/firebase";
import FavIconOutLine from "../../assets/Icons/favourite-outline.svg";
import FavIconFill from "../../assets/Icons/favourite-fill-red.svg";

const DashboardNavBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [NotificationIndicator, setNotificationIndicator] = useState(false);
  const [hover, setHover] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    navigate(user && user.role === "P" ? "/patient/user" : "/doctor/user");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setNotificationIndicator(false);
  };
  const toggleNotificationIndicator = () => {
    setNotificationIndicator(!NotificationIndicator);
  };

  useEffect(() => {
    const appointmentRef = collection(
      db,
      `appointments/${user.id}/appointments`
    );
    const q = query(appointmentRef, where("status", "==", "In Progress"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newNotifications = [];
      querySnapshot.forEach((doc) => {
        const notification = {
          id: doc.id,
          message: `Appointment ${
            doc.data().time
          } is now in progress. Please join.`,
          sestionId: doc.data().sessionId,
        };

        setNotifications((prevNotifications) => {
          const alreadyExists = prevNotifications.some(
            (notif) => notif.id === notification.id
          );
          if (!alreadyExists) {
            newNotifications.push(notification);
          }
          return prevNotifications;
        });
      });

      if (newNotifications.length > 0) {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          ...newNotifications,
        ]);
        toggleNotificationIndicator(true);
      }
    });

    return () => unsubscribe();
  }, [user.id]);

  return (
    <nav
      className={`fixed z-50 bg-gray-100 border-b-1 flex ${
        user ? "flex-row-reverse" : "flex-row"
      } md:flex-row  w-full h-auto p-5 md:px-10 py-2 items-center justify-between`}
    >
      <img
        onClick={toggleMobileMenu}
        className="h-[17px] md:hidden"
        src={menuImg}
        alt="menue"
      />
      <img className="h-[25px] hidden md:flex" src={logo} alt="logo" />
      <img className="h-[15px] md:hidden" src={logoSmall} alt="logo" />
      <div className="flex gap-5 items-center">
        {/* <NavLinks userRole={user?.role} /> */}
        <div className="w-fit flex gap-3 items-center justify-end rounded-full">
          <div
            className={`px-5 py-2 rounded-3xl text-[10px] ${
              user.role == "P" ? "hidden" : "flex"
            }`}
          >
            <Clock />
          </div>
          <div className="relative">
            <img
              className="w-[35px] md:w-[30px] cursor-pointer hover:scale-105 p-1 bg-white border-1 rounded-full"
              src={NotificationIcon}
              alt="notificationIcon"
              onClick={toggleNotifications}
            />
            <div
              className={`bg-green-600 w-[10px] h-[10px] rounded-full absolute top-0 right-0 ${
                NotificationIndicator ? "flex" : "hidden"
              }`}
            />
          </div>
          <div className={`${user.role == "D" ? "hidden" : "flex"}`}>
            <Link to={"/patient/user#favorite"}>
              <img
                className="w-[27px] md:w-[30px] cursor-pointer p-1 bg-white border-1 rounded-full"
                src={hover ? FavIconFill : FavIconOutLine}
                alt="favouriteIcon"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
              />
            </Link>
          </div>
        </div>
        <UserControls
          user={user}
          isDropdownOpen={isDropdownOpen}
          toggleDropdown={toggleDropdown}
          handleProfileClick={handleProfileClick}
          handleLogout={handleLogout}
        />
      </div>
      {showNotifications && (
        <div className="fixed top-0 md:top-12 right-18  md:right-36 mt-2 w-72 bg-white border border-gray-300 rounded-lg shadow-lg p-5 z-50">
          <h4 className="font-semibold text-[14px] md:text-[17px] mb-2">
            Notifications
          </h4>
          <ul>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <li
                  key={notification.id}
                  className="mb-1 text-[12px] md:text-[14px]"
                >
                  {notification.message}
                  <Link to={`/patient/active/${notification.sestionId}`}>
                    <button className="text-lightblueButton hover:scale-105 ">
                      Please Join
                    </button>
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-sm">No new notifications.</li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

const UserControls = ({
  user,
  isDropdownOpen,
  toggleDropdown,
  handleProfileClick,
  handleLogout,
}) => {
  return (
    <div>
      {user ? (
        <div className="relative">
          <img
            src={user.img}
            alt="User"
            style={{ width: 30, height: 30, borderRadius: "50%" }}
            onClick={toggleDropdown}
            className="cursor-pointer"
          />
          {isDropdownOpen && (
            <DropdownMenu
              handleProfileClick={handleProfileClick}
              handleLogout={handleLogout}
            />
          )}
        </div>
      ) : (
        <Link to="/login">
          <p className="px-8 py-1 rounded-full font-bold text-white bg-secondary text-[13px]">
            Login
          </p>
        </Link>
      )}
    </div>
  );
};

const DropdownMenu = ({ handleProfileClick, handleLogout }) => {
  return (
    <div className="absolute  h-screen md:h-fit md:right-0 mt-4 w-48 bg-white border border-gray-300 rounded-lg shadow-lg p-5 flex flex-col gap-2 items-start">
      <button
        onClick={handleProfileClick}
        className="hover:text-lightblueButton hover:scale-105"
      >
        Profile
      </button>
      <button
        onClick={handleLogout}
        className="hover:text-lightblueButton hover:scale-105"
      >
        Logout
      </button>
    </div>
  );
};

export default DashboardNavBar;
