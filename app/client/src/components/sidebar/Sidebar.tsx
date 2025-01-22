import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Collapse from "@mui/material/Collapse";
import SickIcon from '@mui/icons-material/Sick';

const Sidebar = () => {
  const [dishManagementOpen, setDishManagementOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleDishManagementToggle = () => {
    setDishManagementOpen(!dishManagementOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Hamburger Menu Button - Only visible on mobile */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md hover:bg-gray-700/50 transition-colors"
      >
        <MenuIcon className="text-gray-700" />
      </button>

      {/* Rest of the component remains the same */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}

      <div className={`
        fixed lg:static h-screen w-64 bg-gray-500 text-white flex flex-col
        transform transition-transform duration-300 ease-in-out z-50
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <button 
          onClick={closeSidebar}
          className="lg:hidden absolute top-4 right-4 text-white"
        >
          <CloseIcon />
        </button>

        <div className="flex items-center py-6 px-4">
          <img
            src="/images/background.jpg"
            alt="User"
            className="w-20 h-20 rounded-full mr-3"
          />
          <h2 className="text-lg font-semibold">username</h2>
        </div>

        <nav className="flex-grow">
          <ul className="space-y-2 px-4">
            <li>
              <Link
                to="/"
                className="flex items-center space-x-3 p-3 rounded hover:bg-gray-700"
                onClick={closeSidebar}
              >
                <DashboardIcon />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/allergies"
                className="flex items-center space-x-3 p-3 rounded hover:bg-gray-700"
                onClick={closeSidebar}
              >
                <SickIcon />
                <span>Allergies</span>
              </Link>
            </li>
            <li>
              <Link
                to="/schedules"
                className="flex items-center space-x-3 p-3 rounded hover:bg-gray-700"
                onClick={closeSidebar}
              >
                <CalendarMonthIcon />
                <span>Schedules</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleDishManagementToggle}
                className="flex items-center justify-between w-full p-3 rounded hover:bg-gray-700"
              >
                <div className="flex items-center space-x-3">
                  <RestaurantIcon />
                  <span>Dish Management</span>
                </div>
                <ExpandMoreIcon
                  className={`transition-transform ${
                    dishManagementOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <Collapse in={dishManagementOpen}>
                <ul className="ml-6 mt-2 space-y-2">
                  <li>
                    <Link
                      to="/dish-assignment"
                      className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700"
                      onClick={closeSidebar}
                    >
                      <span>Dish Assignment</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/allergen-restrictions"
                      className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700"
                      onClick={closeSidebar}
                    >
                      <span>Allergen Restrictions</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/order-preparations"
                      className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700"
                      onClick={closeSidebar}
                    >
                      <span>Order Preparations</span>
                    </Link>
                  </li>
                </ul>
              </Collapse>
            </li>
          </ul>
        </nav>

        <div className="p-4">
          <Link
            to="/logout"
            className="flex items-center space-x-3 p-3 text-red-500 rounded hover:bg-gray-700"
            onClick={closeSidebar}
          >
            <LogoutIcon />
            <span>Logout</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;