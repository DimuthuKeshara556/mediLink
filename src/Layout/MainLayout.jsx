import React from 'react'
import NavBar from '../Components/NavBar/NavBar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div>
        <NavBar/>
        <Outlet/>
    </div>
  )
}

export default MainLayout