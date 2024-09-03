import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/Images/logo.png";
import logoSmall from "../../assets/Icons/LogoSmall.svg";
import menuImg from "../../assets/Icons/menuSvg.svg";
import { useUser } from "../UserContext/UserContext";

const NavBar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <nav
      className={`fixed z-50 bg-accent flex ${
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
      <div className="flex gap-10 items-center">
        <NavLinks userRole={user?.role} />
        <UserProfile
          user={user}
          isDropdownOpen={isDropdownOpen}
          toggleDropdown={toggleDropdown}
          handleProfileClick={handleProfileClick}
          handleLogout={handleLogout}
        />
      </div>
      {isMobileMenuOpen && (
        <div
          className={`md:hidden w-2/3 h-screen flex flex-col gap-4 absolute top-full   bg-accent p-5 shadow-lg ${
            user ? "right-0" : "left-0"
          } `}
        >
          <NavItem text="About Us" />
          {user?.role !== "D" && <NavItem text="Find a Doctor" />}
          <NavItem text="Emergency Services" />
          <NavItem text="Contact Us" />
        </div>
      )}
    </nav>
  );
};

const NavLinks = ({ userRole }) => {
  return (
    <div className="hidden md:flex gap-5 font-semibold text-[15px]">
      <NavItem text="About Us" path="/about" />
      {userRole !== "D" && (
        <NavItem text="Find a Doctor" path="/patient/doctorlist" />
      )}
      <NavItem
        text="Emergency Services"
        path={userRole === "P" ? "/patient/doctorlist" : "/doctor/home"}
      />
      <NavItem text="Contact Us" path="/contact#footer" />
    </div>
  );
};

const NavItem = ({ text, path }) => {
  return (
    <Link to={path}>
      <p className="hover:text-lightblueButton hover:scale-105">{text}</p>
    </Link>
  );
};

const UserProfile = ({
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
      <Link to={"/patient/user#favorite"}>
        <button
          onClick={handleProfileClick}
          className="hover:text-lightblueButton hover:scale-105"
        >
          Favourite
        </button>
      </Link>
      <button
        onClick={handleLogout}
        className="hover:text-lightblueButton hover:scale-105"
      >
        Logout
      </button>
    </div>
  );
};

export default NavBar;
