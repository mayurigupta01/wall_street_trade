import React from "react";
import "./topbar.css";
import Avatar from '@material-ui/core/Avatar';
import Searchbar from '../search_bar/SearchBar.jsx'
import ShowCredits from "../showCredits/showCredits";

export default function topbar() {
  function logout() {
    localStorage.clear();
    window.location.href = '/';
}
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <div className="logo">Wall Street Trade</div>
        </div>
        <div className="topRight">
          <div className="searchbar">
            {/* <Searchbar /> */}
          </div>
          <div className="searchbar">
            <ShowCredits />
          </div>
            <div className="topbarIconContainer">
              <button className="logoutButton" href="#" onClick={logout}>Logout</button>
            </div>
            <Avatar>WS</Avatar>
          </div>
        </div>
      </div>
  );
}