import React, { useState, useEffect } from "react";
import Recipe from "../../../db/Recipes";

const categories = ["test", "test2", "test3", "test4", "test5"];

function RecipesLeftMenu() {
  const [selectedCategory, setSelectedCategory] = useState();
  const [apiData, setApiData] = useState();

  useEffect(() => {
    console.log(apiData);
    const fetchRecipes = async () => {
      const recipe = new Recipe({});

      try {
        const fetchedRecipes = await recipe.getRecipesByCategory(
          selectedCategory
        );
        setApiData(fetchedRecipes);
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
    <div>
      <select value={selectedCategory} onChange={handleCategoryChange}>
        {categories.map((el, index) => (
          <option key={index} value={el}>
            {el}
          </option>
        ))}
      </select>
      <div></div>
    </div>
  );
}

export default RecipesLeftMenu;
