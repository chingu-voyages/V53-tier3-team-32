import React from "react";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
//import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import SickIcon from '@mui/icons-material/Sick';

const Sidebar: React.FC = () => {
  const [dishManagementOpen, setDishManagementOpen] = React.useState(false);

  const handleDishManagementToggle = () => {
    setDishManagementOpen(!dishManagementOpen);
  };

  return (
    <div className="h-screen w-64 bg-gray-500 text-white flex flex-col">
      {/* User Info */}
      <div className="flex items-center py-6 px-4">
        <img
          src="/images/background.jpg" // Replace with the user's profile image path
          alt="User"
          className="w-20 h-20 rounded-full mr-3"
        />
        <h2 className="text-lg font-semibold">username</h2> {/* Replace with the user's name */}
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow">
        <ul className="space-y-2 px-4">
          <li>
            <Link
              to="/"
              className="flex items-center space-x-3 p-3 rounded hover:bg-gray-700"
            >
              <DashboardIcon />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/allergies"
              className="flex items-center space-x-3 p-3 rounded hover:bg-gray-700"
            >
                <SickIcon />
              <span>Allergies</span>
            </Link>
          </li>
          <li>
            <Link
              to="/schedules"
              className="flex items-center space-x-3 p-3 rounded hover:bg-gray-700"
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
                  >
                    <span>Dish Assignment</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/allergen-restrictions"
                    className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700"
                  >
                    <span>Allergen Restrictions</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/order-preparations"
                    className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700"
                  >
                    <span>Order Preparations</span>
                  </Link>
                </li>
              </ul>
            </Collapse>
          </li>
          {/* <li>
            <Link
              to="/settings"
              className="flex items-center space-x-3 p-3 rounded hover:bg-gray-700"
            >
              <SettingsIcon />
              <span>Settings</span>
            </Link>
          </li> */}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4">
        <Link
          to="/logout"
          className="flex items-center space-x-3 p-3 text-red-500 rounded hover:bg-gray-700"
        >
          <LogoutIcon />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;