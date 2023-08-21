import React, { useState, useContext, useEffect } from "react";
import { notification, Input } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import Recipe from "../../db/Recipes";
import RecipesLeftMenu from "./Recipes-left-menu/RecipesLeftMenu";
import "./Recipes.css";
import RecipeContext from "../PublicRecipes/RecipeContext";
import { cats } from "../../data";
const { TextArea } = Input;

const categories = cats.categories;

const headersBluePrint = [
  {
    id: "ru",
    txt: "",
    placeHolder: "Напишите заголовок",
    headerText: "Заголовок RU",
  },
  {
    id: "en",
    txt: "",
    placeHolder: "Write the title",
    headerText: "Title EN",
  },
  {
    id: "ukr",
    txt: "",
    placeHolder: "Напишіть заголовок",
    headerText: "Заголовок UA",
  },
];

const recipeBluePrint = [
  { id: "en", text: "" },
  { id: "ru", text: "" },
  { id: "uk", text: "" },
];

function Recipes({ editItem, setEditItem }) {
  const { recipeData2, isActive, handleEditClick } = useContext(RecipeContext);

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

  const updateITem = () => {
    if (Object.keys(editItem).length > 0) {
      setHeaders(editItem.headers);
      setRecipeData(editItem.data);
      setNewRecipe(true);
    }
  };
  useEffect(() => {
    updateITem();
  }, [editItem]);

  const handleRecipeSave = async (e) => {
    e.preventDefault();
    const uploadData = {
      selectedCategory,
      uploadImage,
      recipeData,
      headers,
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
  const showFunct = () => {
    setNewRecipe(!newRecipe);
  };

  // useEffect(() => {
  //   console.log(editItem);
  //   if (isActive) {
  //     const filteredCategory = categories.findIndex(
  //       (el) => el === recipeData2.category
  //     );

  //     setNewRecipe(true);
  //     setRecipeData(recipeData2.data);
  //     setSelectedCategory(categories[filteredCategory]);
  //     setHeaders(recipeData2.headerText);
  //     setUploadImage(recipeData2.image);
  //   }
  // }, [isActive, recipeData2]);

  const handleDeleteItemFromFireBase = async (id) => {
    const recipe = new Recipe();
    try {
      const res = await recipe.removeItemFromCollection(id);
      setHeaders(headersBluePrint);
      setRecipeData(recipeBluePrint);
      return api.open({
        message: "Congrats your Market removed correctly 🤩",
        description: `Your Market item removed successfully`,
        icon: <SmileOutlined style={{ color: "#108ee9" }} fill="#108ee9" />,
      });
    } catch (error) {
      api.open({
        message: "Oops something went wrong 🥴",
        description:
          "try again or contact your sys administrator to solve problem",
      });
      console.error("Error saving Market:", error);
    }
  };
  const handleUpdateItem = async (id) => {
    const uploadData = {
      selectedCategory,
      recipeData,
      headers,
      uploadImage,
    };

    const recipe = new Recipe(uploadData);

    try {
      const res = await recipe.updateItem(id);

      setHeaders(headersBluePrint);
      setRecipeData(recipeBluePrint);
      setUploadImage(null);
      setEditItem({});

      return api.open({
        message: "Поздравляю, ваш Маркет обновился корректно 🤩",
        description: `Ваш предмет Market успешно обновлен`,
        icon: <SmileOutlined style={{ color: "#108ee9" }} fill="#108ee9" />,
      });
    } catch (error) {
      api.open({
        message: "Упс! Что-то пошло не так 🥴",
        description:
          "попробуйте еще раз или обратитесь к системному администратору для решения проблемы",
      });
      console.error("Error saving Market:", error);
    }
  };

  const updateOrCreate = () => {
    if (Object.keys(editItem).length > 0) {
      return (
        <button
          type="button"
          style={{
            alignSelf: "flex-end",
            width: 200,
            height: 50,
            borderRadius: 16,
            border: "none",
            background: "orange",
            color: "white",
            margin: "10px 30px 0 0",
            cursor: "pointer",
          }}
          onClick={() => handleUpdateItem(editItem.id)}
        >
          Обновить
        </button>
      );
    } else {
      return (
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
      );
    }
  };

  return (
    <div>
      {contextHolder}
      <div className="recept-header">
        <span>Cоздание статей</span>
        <button className="create-btn" onClick={showFunct}>
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
              borderBottom: "1px solid #5084aa",
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
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="select"
              >
                {categories.map((el, index) => (
                  <option
                    key={index}
                    style={{
                      fontSize: "24px",

                      background: "#eaf9ff",
                    }}
                  >
                    {el}
                  </option>
                ))}
              </select>
              {headers.map((el, ind) => {
                return (
                  <>
                    <p>{el.headerText}</p>
                    <input
                      type="text"
                      value={el.txt}
                      onChange={(e) => onHeadersChange(el.id, e.target.value)}
                      placeholder={el.placeHolder}
                      key={ind}
                      className="input"
                    />
                  </>
                );
              })}
            </div>
            <div
              style={{
                width: 420,
                height: 301,
                display: "flex",
                position: "relative",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <button
                  type="reset"
                  style={{
                    width: "120px",
                    height: "28px",
                    backgroundColor: "#C62020",
                    color: "white",
                    border: "none",
                    alignContent: "center",
                    borderRadius: "77px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setUploadImage(null);
                    setEditItem({ ...editItem, image: "" });
                  }}
                >
                  удалить
                </button>
                <label htmlFor="uploadLabel">
                  <div
                    style={{
                      width: "120px",
                      height: "28px",
                      backgroundColor: "#19933B",
                      color: "white",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "77px",
                      cursor: "pointer",
                    }}
                  >
                    загрузить
                  </div>
                </label>
              </div>
              {uploadImage ? (
                <img
                  src={URL.createObjectURL(uploadImage)}
                  alt={`Recipe Photo`}
                  style={{
                    height: "100%",
                    alignSelf: "center",
                    maxWidth: "100%",
                    marginBottom: "35px",
                    boxShadow: "0px 12px 25px -1px rgba(66,66,66,0.66)",
                  }}
                />
              ) : editItem.image ? (
                <img
                  src={editItem.image}
                  alt={`Recipe Photo`}
                  style={{
                    height: "100%",
                    justifySelf: "center",
                    maxWidth: "100%",
                    marginBottom: "35px",
                  }}
                />
              ) : null}
              <input
                type="file"
                onChange={(e) => handleImageChange(e.target.files[0])}
                style={{
                  display: "none",
                }}
                id="uploadLabel"
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
                    height: '60vh',
                    overflowX: 'hidden',
                    overflowY: 'auto'
                  }}
                >
                  <p>Текст рецепта {el.id}</p>
                  <TextArea
                    placeholder={`Текст рецепта (${el.id})`}
                    value={el.text}
                    onChange={(e) =>
                      handleRecipeTextChange(index, e.target.value)
                    }
                    autoSize={{ minRows: 10, maxRows: 5 }}
                    key={index}
                    className="textarea"
                  />
                </div>
              );
            })}
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="reset"
              style={{
                alignSelf: "flex-end",
                width: 200,
                height: 50,
                borderRadius: 16,
                border: "none",
                background: "red",
                color: "white",
                margin: "10px 30px 0 0",
                cursor: "pointer",
              }}
              onClick={() => handleDeleteItemFromFireBase(editItem.id)}
            >
              удалитъ
            </button>
            {updateOrCreate()}
          </div>
        </form>
      )}
    </div>
  );
}

export default Recipes;
