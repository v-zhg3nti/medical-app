import React, { useEffect, useState, useContext } from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import DashboardLeftBar from "./Dashboard-left-bar/DashboardLeftBar";
import Recipes from ".././Recipes/Recipes";
import Library from ".././Library/Library";
import "./Dashboard.css";
import MenuLibrary from "../Library/MenuLibrary";
import PublicRecipes from "../PublicRecipes/PublicRecipes";
import MarketPlace from "../Market/MarketPlace";
import PublicMarket from "../Market/PublicMarket/PublicMarket";

const menuItems = [
  { id: "меню", Component: Recipes },
  { id: "библиотека", Component: Library },
  { id: "Торговая площадка", Component: MarketPlace },
];

const subMenuItems = [
  { id: "меню", Component: PublicRecipes },
  { id: "библиотека", Component: MenuLibrary },
  { id: "Торговая площадка", Component: PublicMarket },
];

function Dashboard() {
  const navigate = useNavigate();

  const [component, setComponent] = useState(menuItems[1]);
  const [menuComponent, setMenuComponent] = useState(subMenuItems[1]);
  const [index, setIndex] = useState("библиотека");

  const onComponentClick = (id) => {
    const index = menuItems.findIndex((el) => el.id === id);
    const menu = subMenuItems[index];
    const comp = menuItems[index];
    setComponent(comp);
    setMenuComponent(menu);
    setIndex(id);
  };

  const out = () => {
    signOut(auth);
    navigate("/login");
  };

  const [categoryApiData, setCategoriesApiData] = useState();

  return (
    <div className="dashboard-wrapper">
      <DashboardLeftBar
        menuItems={menuItems}
        onComponentClick={onComponentClick}
        index={index}
      />

      <div className="components-container">
        <component.Component />
      </div>

      <div className="menu-items">
        <menuComponent.Component />
      </div>
    </div>
  );
}

export default Dashboard;
