import React from "react";
import Logout from "../pages/Logout";
import "../styles/Logout.css";

const LogoutPage = () => {
  return (
    <button className="logout-btn" onClick={Logout}>
      Logout
    </button>
  );
};

export default LogoutPage;
