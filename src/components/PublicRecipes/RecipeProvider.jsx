import React, {useState} from "react";
import RecipeContext from "./RecipeContext";

const RecipeProvider = ({children}) => {
  const [recipeData2, setRecipeData2] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const handleEditClick = (recipe) => {
    setRecipeData2(recipe);
    setIsActive(true);
  };

  return (
    <RecipeContext.Provider value={{recipeData2, isActive, handleEditClick}}>
      {children}
    </RecipeContext.Provider>
  );
};

export default RecipeProvider;
