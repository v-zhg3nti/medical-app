import React, { useState } from "react";
import { notification, Input } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import Recipe from "../../db/Recipes";
import RecipesLeftMenu from "./Recipes-left-menu/RecipesLeftMenu";
import "./Recipes.css";

const { TextArea } = Input;

const categories = ["test", "test2", "test3", "test4", "test5"];

const headersBluePrint = [
  { id: "en", txt: "", placeHolder: "Write the title" },
  { id: "ru", txt: "", placeHolder: "Напишите заголовок" },
  { id: "ukr", txt: "", placeHolder: "Напишіть заголовок" },
];

const recipeBluePrint = [
  { id: "en", text: "" },
  { id: "ru", text: "" },
  { id: "uk", text: "" },
];

function Recipes() {
  const [api, contextHolder] = notification.useNotification();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [headers, setHeaders] = useState(headersBluePrint);
  const [uploadImage, setUploadImage] = useState(null);
  const [recipeData, setRecipeData] = useState(recipeBluePrint);
  const [newRecipe, setNewRecipe] = useState(false);
  const onHeadersChange = (id, value) => {
    const newHeaders = [...headers];
    const index = newHeaders.findIndex((el) => el.id === id);
    newHeaders[index].txt = value;
    setHeaders(newHeaders);
  };

  const handleImageChange = (value) => {
    setUploadImage(value);
  };

  const handleRecipeTextChange = (index, value) => {
    const newRecipeData = [...recipeData];
    newRecipeData[index].text = value;
    setRecipeData(newRecipeData);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleRecipeSave = async (e) => {
    e.preventDefault();
    const uploadData = {
      selectedCategory,
      uploadImage,
      recipeData,
    };

    const recipe = new Recipe(uploadData);

    try {
      const result = await recipe.saveRecipe();
      return api.open({
        message: "Congrats your recipe saved correctly 🤩",
        description: `Your recipe saved successfully with id ${result}`,
        icon: <SmileOutlined style={{ color: "#108ee9" }} fill="#108ee9" />,
      });
    } catch (error) {
      api.open({
        message: "Oops something went wrong 🥴",
        description:
          "try again or contact your sys administrator to solve problem",
      });
      console.error("Error saving recipe:", error);
    }
  };

  const handleCreateRecept = () => {
    setNewRecipe(!newRecipe);
  };

  return (
    <div>
      {contextHolder}
      <div className="recept-header">
        <span>Cоздание статей</span>
        <button className="create-btn" onClick={handleCreateRecept}>
          Cоздать рецепт
        </button>
      </div>
      {newRecipe && (
        <form
          style={{
            width: "100%",

            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
          onSubmit={handleRecipeSave}
        >
          <div
            style={{
              display: "flex",
              background: "#eaf9ff",
              width: "100%",
              height: 400,
              alignItems: "center",
              justifyContent: "space-evenly",
              borderBottom: "3px solid #c7edfc",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: 400,
                height: 260,
                padding: 16,
                justifyContent: "space-around",
              }}
            >
              <select onChange={handleCategoryChange} className="select">
                {categories.map((el, index) => (
                  <option
                    key={index}
                    style={{ fontSize: "24px", background: "#eaf9ff" }}
                  >
                    {el}
                  </option>
                ))}
              </select>
              {headers.map((el, ind) => {
                return (
                  <input
                    type="text"
                    value={el.txt}
                    onChange={(e) => onHeadersChange(el.id, e.target.value)}
                    placeholder={el.placeHolder}
                    key={ind}
                    className="input"
                  />
                );
              })}
            </div>
            <div
              style={{
                width: 400,
                height: 300,
                display: "flex",
                position: "relative",
              }}
            >
              {uploadImage && (
                <img
                  src={URL.createObjectURL(uploadImage)}
                  alt={`Recipe Photo`}
                  style={{ width: "100%", height: "100%" }}
                />
              )}
              <input
                type="file"
                onChange={(e) => handleImageChange(e.target.files[0])}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  translateY: "auto",
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              background: "white",
              gap: 40,
              width: "100%",
              height: 300,
              padding: 32,
            }}
          >
            {recipeData.map((el, index) => {
              return (
                <div
                  style={{
                    width: "33.3%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <p>Recipe Text {el.id}</p>
                  <TextArea
                    placeholder={`Recipe Text (${el.id})`}
                    value={el.text}
                    onChange={(e) =>
                      handleRecipeTextChange(index, e.target.value)
                    }
                    autoSize={{ minRows: 10, maxRows: 5 }}
                    key={index}
                  />
                </div>
              );
            })}
          </div>
          <button
            type="submit"
            style={{
              alignSelf: "flex-end",
              width: 200,
              height: 50,
              borderRadius: 16,
              border: "none",
              background: "green",
              color: "white",
              margin: "10px 30px 0 0",
              cursor: "pointer",
            }}
          >
            создать
          </button>
        </form>
      )}
    </div>
  );
}

export default Recipes;
