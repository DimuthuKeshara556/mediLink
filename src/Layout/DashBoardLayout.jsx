import React from "react";
import SideNavigation from "../Components/SideNavigation/SideNavigation";
import { Outlet } from "react-router-dom";
import { useUser } from "../Components/UserContext/UserContext";
import SideNavigationDoctor from "../Components/pages/DoctorDashBoard/SideNavigationDoctor/SideNavigationDoctor";
import DashboardNavBar from "../Components/NavBar/DashboardNavBar";

const DashBoardLayout = () => {
  const { user} = useUser();
  return (
    <div>
      <DashboardNavBar />
      {user && user.role === "P" ? <SideNavigation /> : <SideNavigationDoctor />}
      <Outlet />
    </div>
  );
};

export default DashBoardLayout;
