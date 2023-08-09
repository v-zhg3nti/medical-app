import "./PublicRecipes.css";
import React, { useState, useEffect } from "react";
import Recipe from "../../db/Recipes";

const categories = ["test", "test2", "test3", "test4", "test5"];

const PublicRecipes = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const recipe = new Recipe({});

      try {
        const fetchedRecipes = await recipe.getRecipesByCategory(
          selectedCategory
        );
        if(fetchedRecipes){
          setApiData(fetchedRecipes);
        } else{
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
              <img src={recipe.image} alt={recipe.category} className="image" />
              {recipe.data.map((data, index) => (
                <div key={index}>{data.id === "en" && <p>{data.text}</p>}</div>
              ))}
              <button className="edit-button">редактировать</button>
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
