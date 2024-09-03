import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../../Layout/MainLayout";
import WebContext from "../../WebContext/WebContext";
import UserDashBoard from "../UserDashBoard/UserDashBoard";
import AppointmentPage from "../pages/AppointmentPage/AppointmentPage";
import UserProfile from "../pages/UserDashboard/UserProfile/UserProfile";
import Medication from "../pages/Medication/Medication";
import DoctorList from "../pages/UserDashboard/DoctorList/DoctorList";
import CreateAppoinmentPage from "../pages/CreateAppoinmentPage/CreateAppoinmentPage";
import PdfComponent from "../pages/Test/PdfComponent";
import DoctorDashBoard from "../pages/DoctorDashBoard/DoctorDashBoard";
import DashBoardLayout from "../../Layout/DashBoardLayout";
import Unkown from "../pages/Unkown";
import { AuthProvider } from "../AuthContext/AuthContext";
import SignUp from "../Authentication/SignUpPages/SignUp";

import DoctorHome from "../pages/DoctorDashBoard/DoctorHome";
import EditUserPage from "../pages/UserDashboard/UserDetailComponent/EditUserPage";

import DoctorDetailPage from "../pages/DoctorDashBoard/DoctorDetailePage/DoctorDetailPage";
import Settings from "../pages/DoctorDashBoard/Settings/Settings";
import OngoingAppoinment from "../pages/UserDashboard/OngoingAppoinment/OngoingAppoinment";
import { useUser } from "../UserContext/UserContext";

import MultiStepForm from "../Authentication/SignUpPages/MultiStepFormForPatient/MultiStepForm";
import MultiStepFormDoctor from "../Authentication/SignUpPages/MultiStepFormForDoctor/MultiStepFormDoctor";
import Login from "../Authentication/LoginPage/Login";
import HistoryPage from "../pages/UserDashboard/HistoryPage/HistoryPage";
import ReSchedulePage from "../pages/UserDashboard/ReSchedulePage/ReSchedulePage";
import DoctorHistory from "../pages/DoctorDashBoard/DoctorHistory/DoctorHistory";

const AppRouters = () => {
  const { user } = useUser();

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route
              index
              element={
                !user ? (
                  <WebContext />
                ) : user.role === "P" ? (
                  <Navigate to="/patient/Application" />
                ) : user.role === "D" ? (
                  <Navigate to="/doctor/home" />
                ) : (
                  <Unkown />
                )
              }
            />
            <Route path="about" element={<WebContext />} />
            <Route path="contact" element={<WebContext />} />
            <Route
              path="home"
              element={
                !user ? (
                  <Login />
                ) : user.role === "P" ? (
                  <Navigate to="/patient/Application" />
                ) : user.role === "D" ? (
                  <Navigate to="/doctor/home" />
                ) : (
                  <Unkown />
                )
              }
            />
            <Route path="error" element={<Unkown />} />
          </Route>
          <Route
            path="/patient"
            element={!user ? <Login /> : <DashBoardLayout />}
          >
            <Route path="Application" element={<UserDashBoard />} />
            <Route
              path="appointment"
              element={!user ? <Login /> : <AppointmentPage />}
            />
            <Route path="user" element={<UserProfile />} />
            <Route path="edit" element={<EditUserPage />} />
            <Route path="reschedule/:dataId" element={<ReSchedulePage />} />
            <Route path="medication" element={<Medication />} />
            <Route
              path="doctorlist"
              element={!user ? <Login /> : <DoctorList />}
            />
            <Route
              path="history"
              element={!user ? <Login /> : <HistoryPage />}
            />
            <Route
              path="newapoinment/:dataId"
              element={<CreateAppoinmentPage />}
            />
            <Route path="test" element={<PdfComponent />} />
            <Route path="active/:sessionId" element={<OngoingAppoinment />} />
          </Route>
          <Route
            path="/doctor"
            element={!user ? <Login /> : <DashBoardLayout />}
          >
            <Route path="home" element={<DoctorHome />} />
            <Route path="Application/:dataId" element={<DoctorDashBoard />} />
            <Route path="history" element={<DoctorHistory />} />
            <Route path="settings" element={<Settings />} />
            <Route path="user" element={<DoctorDetailPage />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signupdoc" element={<MultiStepFormDoctor />} />
          <Route path="/signupp" element={<MultiStepForm />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouters;
