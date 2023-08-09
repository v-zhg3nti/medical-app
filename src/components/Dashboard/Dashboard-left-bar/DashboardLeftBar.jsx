import React, { useState } from "react";
// import Recipes from "../../Recipes/Recipes";
// import Library from "../../Library/Library";
import "./DashboardLeftBar.css";

function DashboardLeftBar({ menuItems, onComponentClick, index }) {
  return (
    <div className="left-bar-wrapper">
      <div className="left-bar-menu">
        <ul>
          {menuItems.map((el) => (
            <li key={el.id} onClick={() => onComponentClick(el.id)} className={`${index === el.id ? 'dark-list' : ''}`}>
              <span>{el.id}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DashboardLeftBar;
