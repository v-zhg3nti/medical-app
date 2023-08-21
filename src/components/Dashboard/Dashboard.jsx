import React, { useEffect, useState, useContext } from "react";
import RecipeProvider from "../PublicRecipes/RecipeProvider";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import DashboardLeftBar from "./Dashboard-left-bar/DashboardLeftBar";
import Recipes from ".././Recipes/Recipes";
import Library from ".././Library/Library";
import MenuLibrary from "../Library/MenuLibrary";
import PublicRecipes from "../PublicRecipes/PublicRecipes";
import MarketPlace from "../Market/MarketPlace";
import PublicMarket from "../Market/PublicMarket/PublicMarket";
import Quiz from "../Quiz/Quiz";
import "./Dashboard.css";
import PublicQuiz from "../Quiz/EachQuiz/PublicQuiz";

const menuItems = [
  { id: "библиотека", Component: Library },
  { id: "Магазин", Component: MarketPlace },
  { id: "Рецепты", Component: Recipes },
  { id: "Минитесты", Component: Quiz },
];

const subMenuItems = [
  { id: "библиотека", Component: MenuLibrary },
  { id: "Магазин", Component: PublicMarket },
  { id: "Рецепты", Component: PublicRecipes },
  { id: "Минитесты", Component: PublicQuiz },
];

function Dashboard() {
  const navigate = useNavigate();

  const [dataState, setDataState] = useState([]);
  const [component, setComponent] = useState(menuItems[0]);
  const [menuComponent, setMenuComponent] = useState(subMenuItems[0]);
  const [index, setIndex] = useState("библиотека");
  const [newRecipe, setNewRecipe] = useState(false);

  const [editItem, setEditItem] = useState({});
  const [editQuiz, setEditQuiz] = useState({});
  const [editArticle, setEditArticle] = useState({});

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

  const editEachItem = (item) => {
    setEditItem(item);
  };
  const [categoryApiData, setCategoriesApiData] = useState();

  const functForChild = (data) => {
    return setDataState(data);
  };

  const handleEditQuiz = (quiz) => {
    return setEditQuiz(quiz);
  };

  const handleEditArticle = (article) => {
    return setEditArticle(article);
  };

  return (
    <RecipeProvider>
      <div className="dashboard-wrapper">
        <DashboardLeftBar
          menuItems={menuItems}
          onComponentClick={onComponentClick}
          index={index}
        />

        <div className="components-container">
          <component.Component
            editItem={editItem}
            setEditItem={setEditItem}
            editQuiz={editQuiz}
            editArticle={editArticle}
          />
        </div>

        <div className="menu-items">
          <menuComponent.Component
            editEachItem={editEachItem}
            setEditItem={setEditItem}
            handleEditQuiz={handleEditQuiz}
            handleEditArticle={handleEditArticle}
          />
        </div>
      </div>
    </RecipeProvider>
  );
}

export default Dashboard;
