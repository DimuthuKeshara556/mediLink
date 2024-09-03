import React from "react";
import AppRouters from "./Components/Routers/AppRouters";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { UserProvider } from "./Components/UserContext/UserContext";
import "./App.css"; 


function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <UserProvider>
      <AppRouters />
      </UserProvider>
    </LocalizationProvider>
  );
}

export default App;
