import "./PublicRecipes.css";
import { useContext } from "react";
import React, { useState, useEffect } from "react";
import Recipe from "../../db/Recipes";
import noimage from "../../assets/no-photo.jpg";
import RecipeContext from "./RecipeContext";
import { cats } from "../../data";
const categories = cats.categories;

const PublicRecipes = ({ setEditItem }) => {
  const { handleEditClick } = useContext(RecipeContext);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const recipe = new Recipe({});

      try {
        const fetchedRecipes = await recipe.getRecipesByCategory(
          selectedCategory
        );
        if (fetchedRecipes) {
          setApiData(fetchedRecipes);
        } else {
          setApiData(null);
        }
      } catch (error) {
        console.error("Error fetching recipes: ", error);
      }
    };

    fetchRecipes();
  }, [selectedCategory]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const recEditFunciton = (recipe, index) => {
    return recipe;
  };

  return (
    <div className="recipe-wrapper">
      <div className="recipe-header">
        <h2>Публичные рецепты</h2>
        <select className="select" onChange={handleCategoryChange}>
          {categories.map((option) => (
            <option key={option} className="option">
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="recipe-body">
        {apiData.length > 0 ? (
          apiData.map((recipe, index) => (
            <div key={index} className="recipe-item">
              <h3>{recipe.category}</h3>
              <img
                src={recipe.image ? recipe.image : noimage}
                alt={recipe.category}
                className="image"
              />
              {recipe.data.map((data, index) => (
                <div key={index}>{data.id === "en" && <p>{data.text}</p>}</div>
              ))}
              <button
                onClick={() => setEditItem(recipe)}
                className="edit-button"
              >
                редактировать
              </button>
            </div>
          ))
        ) : (
          <p>Нет активных элементов</p>
        )}
      </div>
    </div>
  );
};

export default PublicRecipes;
