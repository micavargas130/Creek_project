import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BookIcon from '@mui/icons-material/Book';
import CottageIcon from '@mui/icons-material/Cottage';
import InsertChartIcon from "@mui/icons-material/InsertChart";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FestivalIcon from '@mui/icons-material/Festival';
import BadgeIcon from '@mui/icons-material/Badge';
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link } from "react-router-dom";
import { useState } from "react";
import { UserContext } from "../../context/UserContext.jsx";
import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Sidebar = () => {
  const { ready, user, setUser } = useContext(UserContext);
  const [redirect, setRedirect] = useState(null);
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
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
            <Link to="/" style={{ textDecoration: "none" }}>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </Link>
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
          <Link to="/tents" style={{ textDecoration: "none" }}>
            <li>
              <FestivalIcon className="icon" />
              <span>Carpas</span>
            </li>
          </Link> 
          {!user.isEmployee && (
    <div>
        <p className="title">USEFUL</p>
        <Link to="/Accounting" style={{ textDecoration: "none" }}>
            <li>
                <InsertChartIcon className="icon" />
                <span>Ingresos</span>
            </li>
        </Link>
        <Link to="/employees" style={{ textDecoration: "none" }}>
            <li>
                <BadgeIcon className="icon" />
                <span>Empleados</span>
            </li>
        </Link>
    </div>
)}
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
    </div>
  );
};

export default Sidebar;
