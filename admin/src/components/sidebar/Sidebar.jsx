import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BookIcon from '@mui/icons-material/Book';
import CottageIcon from '@mui/icons-material/Cottage';
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link } from "react-router-dom";
import { useState } from "react";
import { UserContext} from "../../context/UserContext.jsx";
import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
//import { DarkModeContext } from "../../context/darkModeContext";
//import { useContext } from "react";

const Sidebar = () => {
  //const { dispatch } = useContext(DarkModeContext);
  const{ready,user,setUser} = useContext(UserContext);
  const [redirect, setRedirect] = useState(null);
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
    const handleLogout = () => {
      // Realiza el logout enviando una acción al reducer
      dispatch({ type: "LOGOUT" });
      navigate("/");
    };
  

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Creek</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <li>
            <DashboardIcon className="icon" />
            <span>Dashboard</span>
          </li>
          <p className="title">LISTS</p>
          <Link to="/bookings" style={{ textDecoration: "none" }}>
            <li>
              <BookIcon className="icon" />
              <span>Reservations</span>
            </li>
          </Link>
          <Link to="/lodges" style={{ textDecoration: "none" }}>
            <li>
              <CottageIcon className="icon" />
              <span>Cabañas</span>
            </li>
          </Link> 
          <li>
          <Link to="/tents" style={{ textDecoration: "none" }}>
            <li>
            <CreditCardIcon className="icon" />
            <span>Carpas</span>
            </li>
          </Link> 
          </li>
          <li>
            <LocalShippingIcon className="icon" />
            <span>Delivery</span>
          </li>
          <p className="title">USEFUL</p>
          <li>
            <InsertChartIcon className="icon" />
            <span>Stats</span>
          </li>
          <li>
            <NotificationsNoneIcon className="icon" />
            <span>Notifications</span>
          </li>
          <p className="title">SERVICE</p>
          <li>
            <SettingsSystemDaydreamOutlinedIcon className="icon" />
            <span>System Health</span>
          </li>
          <li>
            <PsychologyOutlinedIcon className="icon" />
            <span>Logs</span>
          </li>
          <li>
            <SettingsApplicationsIcon className="icon" />
            <span>Settings</span>
          </li>
          <p className="title">USER</p>
          <li>
            <AccountCircleOutlinedIcon className="icon" />
            <span>Profile</span>
          </li>
          
          <li>
            <ExitToAppIcon className="icon" />
            <span onClick={handleLogout}>Logout</span>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div
          className="colorOption"
         // onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          //onClick={() => dispatch({ type: "DARK" })}
        ></div>
      </div>
    </div>
  );
};

export default Sidebar;
