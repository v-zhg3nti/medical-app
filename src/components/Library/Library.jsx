import React, { useEffect, useState } from "react";
import { notification, Input } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Button } from "antd";
import chevron from "../../assets/Vector.svg";
import Articles from "../../db/Articles";
import { cats } from "../../data/index";
import useWindowSize from "../../hooks/useWindowSize";
import "./Library.css";

const { TextArea } = Input;

const articleBluePrint = [
  {
    en: "",
    ru: "",
    uk: "",
    imgSrc: "",
    renderImage: "",
  },
  {
    en: "",
    ru: "",
    uk: "",
    imgSrc: "",
  },
  {
    en: "",
    ru: "",
    uk: "",
    imgSrc: "",
    renderImage: "",
  },
  {
    en: "",
    ru: "",
    uk: "",
    imgSrc: "",
    renderImage: "",
  },
  {
    en: "",
    ru: "",
    uk: "",
    imgSrc: "",
    renderImage: "",
  },
];

const headersBluePrint = [
  { id: "ru", txt: "" },
  { id: "en", txt: "" },
  { id: "uk", txt: "" },
];

function Library({ editArticle }) {
  const [dropdownVisible, setDropdownVisible] = useState([]);
  const [isInputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editingOptionIndex, setEditingOptionIndex] = useState(null);

  const [api, contextHolder] = notification.useNotification();
  const [articles, setArticles] = useState(articleBluePrint);
  const [headers, setHeaders] = useState(headersBluePrint);

  const [appear, setAppear] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState(["", "", ""]);
  const [categories, setCategories] = useState([
    [...cats.categories],
    [...(cats.subCategories[selectedCategories[1]] || [""])],
  ]);
  const handleCategoryChange = (index, value) => {
    const newSelectedCategories = [...selectedCategories];
    newSelectedCategories[index] = value;
    if (index === 0) {
      newSelectedCategories[1] = "";
      categories.length = 2;
    }
    setSelectedCategories(newSelectedCategories);
    let updatedSubcategories = cats.subCategories[value] || [];
    console.log("updatedSubcategories", updatedSubcategories);
    if (index === 1) {
      updatedSubcategories = cats.subCategories[selectedCategories[0]] || [];
    } else if (index === 2) {
      updatedSubcategories = cats.subCategories[selectedCategories[0]] || [];
    }

    const newCategories = [...categories];
    newCategories[1] = updatedSubcategories;

    if (
      newSelectedCategories[1] === "Сердечно-сосудистые заболевания" &&
      index === 1
    ) {
      newCategories[2] = cats.subCategories["subSubCategory"];
    } else if (
      newSelectedCategories[1] !== "" &&
      newSelectedCategories[1] !== "Сердечно-сосудистые заболевания" &&
      index == 1
    ) {
      console.log("newCategories[2]", newCategories[2]);
      newCategories.length = 2;
    }
    setCategories(newCategories);
  };

  const onHeadersChange = (id, value) => {
    const newHeaders = [...headers];
    const element = newHeaders.find((el) => el.id === id);
    element.txt = value;
    setHeaders(newHeaders);
  };

  const handleInputUpdate = () => {
    if (Object.keys(editArticle).length > 0) {
      setArticles(editArticle.articles);
      setHeaders(editArticle.headers);
      setSelectedCategories(editArticle.selectedCategories);
      setAppear(true);
    }
  };
  useEffect(() => {
    handleInputUpdate();
  }, [editArticle]);

  const handleArticleTextChange = (elementIndex, lang, value) => {
    setArticles((prevState) => {
      const newState = [...prevState].map((element, index) => {
        if (elementIndex === index) {
          element = { ...element, [lang]: value };
          return element;
        }
        return element;
      });
      return newState;
    });
  };

  const handleImgLinkChange = (value, index) => {
    console.log("@@@value", value);
    setArticles((prevState) => {
      const newArticles = prevState.map((element, i) => {
        if (index === i) {
          return {
            ...element,
            imgSrc: value,
            renderImage: value ? URL.createObjectURL(value) : "",
          };
        }
        return element;
      });
      return newArticles;
    });
  };

  const toggleArticleDashboard = () => {
    setAppear(!appear);
  };

  const onArticleSubmit = async () => {
    const articlesData = {
      articles,
      selectedCategories,
      headers,
    };

    const article = new Articles(articlesData);

    try {
      const result = await article.saveArticles();

      return api.open({
        message: "Поздравляю, ваша статья сохранена правильно 🤩",
        description: `Ваша статья успешно сохранена с идентификатором ${result}`,
        icon: <SmileOutlined style={{ color: "#108ee9" }} fill="#108ee9" />,
      });
    } catch (error) {
      api.open({
        message: "Упс! Что-то пошло не так 🥴",
        description:
          "попробуйте еще раз или обратитесь к системному администратору для решения проблемы",
      });
      console.error("Error:", error);
    }
  };
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputSubmit = () => {
    if (editingOptionIndex !== null) {
      const newCategories = [...categories];
      newCategories[editingOptionIndex.categoryIndex][
        editingOptionIndex.optionIndex
      ] = inputValue;
      setInputVisible(false);
      setInputValue("");
      setEditingOptionIndex(null);
    }
  };
  const handleOptionButtonClick = (event, categoryIndex, optionIndex) => {
    event.stopPropagation();
    setInputVisible(true);
    setInputValue(categories[categoryIndex][optionIndex]);
    setEditingOptionIndex({ categoryIndex, optionIndex });
  };
  const handleDropdownVisibleChange = (index, visible) => {
    const newVisibility = [...dropdownVisible];
    newVisibility[index] = visible;
    setDropdownVisible(newVisibility);
  };

  const windowSize = useWindowSize(); // custom window size hook

  const renderDropdown = (options, index) => {
    const menu = (
      <Menu style={{ backgroundColor: "white" }}>
        {options.map((option, optionIndex) => (
          <Menu.Item
            key={optionIndex}
            style={{
              textAlign: "center",
              border: "1px solid #ccc",
              borderRadius: "50px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span
                style={{ width: "100%" }}
                onClick={() => handleCategoryChange(index, option)}
              >
                {option}
              </span>
            </div>
          </Menu.Item>
        ))}{" "}
        {isInputVisible && (
          <div style={{ display: "flex" }}>
            <Input value={inputValue} onChange={handleInputChange} />
            <Button onClick={handleInputSubmit}>Вариант обновления</Button>
          </div>
        )}
      </Menu>
    );

    return (
      <Dropdown
        overlay={menu}
        style={{ width: "100%" }}
        trigger={["click"]}
        visible={dropdownVisible[index]}
        onVisibleChange={(visible) =>
          handleDropdownVisibleChange(index, visible)
        }
      >
        <Button
          style={{
            width: "100%",
            height: "50px",
            border: "1px solid #0084ce",
            borderRadius: "30px",
            backgroundColor: "transparent",
            color: "#242424",
            textAlign: "center",
            padding: "8px 24px",
            position: "relative",
          }}
        >
          {selectedCategories[index] || "Выберите категорию"}
          <img
            src={chevron}
            alt="dropdown arrow"
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
        </Button>
      </Dropdown>
    );
  };
  const handleUpdateArticle = async (id) => {
    try {
      const articlesData = {
        articles,
        selectedCategories,
        headers,
      };

      const article = new Articles(articlesData);
      const res = await article.updateArticlesById(id);
      return api.open({
        message: "Поздравляем, ваша статья была обновлена ​​ 🤩",
        icon: <SmileOutlined style={{ color: "#108ee9" }} fill="#108ee9" />,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteArticle = async (id) => {
    const article = new Articles({});
    const res = await article.deleteArticlesById(id);
    return api.open({
      message: "Congrats your Article deleted correctly 🤩",
      description: `Your Market Article deleted successfully`,
      icon: <SmileOutlined style={{ color: "#108ee9" }} fill="#108ee9" />,
    });
  };

  const removeOrUpdateBtn = () => {
    if (Object.keys(editArticle).length > 0) {
      return (
        <button
          className="update-button"
          onClick={() => handleUpdateArticle(editArticle.id)}
        >
          обновлять
        </button>
      );
    } else {
      return (
        <button className="create-button" onClick={() => onArticleSubmit()}>
          Опубликовать
        </button>
      );
    }
  };

  return (
    <div className="library-wrapper">
      {contextHolder}
      <div className="library-header-1">
        <span>Cоздание статей</span>
        <button onClick={() => toggleArticleDashboard()}>Cоздать статью</button>
      </div>
      {appear && (
        <>
          <div className="library-header-2">
            {categories.map((options, index) => renderDropdown(options, index))}
          </div>
          <div className="library-header-3">
            {headers.map((el) => (
              <input
                placeholder={`заголовок_${el.id}`}
                key={el.id}
                value={el.txt}
                onChange={(e) => onHeadersChange(el.id, e.target.value)}
              />
            ))}
          </div>
          <div className="library-articles">
            {articles.map((el, articleIndex) => (
              <div
                key={articleIndex}
                style={{
                  display: "flex",
                }}
              >
                <div className="each-library-article ">
                  <div style={{ display: "flex" }}>
                    {el.imgSrc === "" && (
                      <>
                        <label
                          style={{ alignSelf: "center" }}
                          htmlFor={`uploadLabel-${articleIndex}`}
                        >
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
                            Загрузить
                          </div>
                        </label>
                        <input
                          id={`uploadLabel-${articleIndex}`}
                          style={{ display: "none" }}
                          type="file"
                          onChange={(e) =>
                            handleImgLinkChange(e.target.files[0], articleIndex)
                          }
                        />
                      </>
                    )}
                    {el.renderImage ? (
                      <>
                        <div className="image-wrapper">
                          <img src={el.renderImage} width={"100%"} />
                          <div
                            style={{
                              display: "flex",
                              alignSelf: "center",
                            }}
                          >
                            <button
                              onClick={() =>
                                handleImgLinkChange("", articleIndex)
                              }
                              style={{
                                padding: 8,
                                backgroundColor: "#C62020",
                                color: "white",
                                border: "none",
                                alignContent: "center",
                                borderRadius: "77px",
                                cursor: "pointer",
                                marginRight: 4,
                              }}
                            >
                              Удалить
                            </button>
                            <label htmlFor={`uploadLabel-${articleIndex}`}>
                              <div
                                style={{
                                  padding: 8,
                                  backgroundColor: "#19933B",
                                  color: "white",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  borderRadius: "77px",
                                  cursor: "pointer",
                                }}
                              >
                                Измени фотографию
                              </div>
                            </label>
                            <input
                              id={`uploadLabel-${articleIndex}`}
                              style={{ display: "none" }}
                              type="file"
                              onChange={(e) =>
                                handleImgLinkChange(
                                  e.target.files[0],
                                  articleIndex
                                )
                              }
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      el.imgSrc && (
                        <>
                          <div className="image-wrapper">
                            <img src={el.imgSrc} width={"100%"} />
                            <div
                              style={{
                                display: "flex",
                                alignSelf: "center",
                              }}
                            >
                              <button
                                onClick={() =>
                                  handleImgLinkChange("", articleIndex)
                                }
                                style={{
                                  padding: 8,
                                  backgroundColor: "#C62020",
                                  color: "white",
                                  border: "none",
                                  alignContent: "center",
                                  borderRadius: "77px",
                                  cursor: "pointer",
                                  marginRight: 4,
                                }}
                              >
                                Удалить
                              </button>
                              <label htmlFor={`uploadLabel-${articleIndex}`}>
                                <div
                                  style={{
                                    padding: 8,
                                    backgroundColor: "#19933B",
                                    color: "white",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: "77px",
                                    cursor: "pointer",
                                  }}
                                >
                                  Измени фотографию
                                </div>
                              </label>
                              <input
                                id={`uploadLabel-${articleIndex}`}
                                style={{ display: "none" }}
                                type="file"
                                onChange={(e) =>
                                  handleImgLinkChange(
                                    e.target.files[0],
                                    articleIndex
                                  )
                                }
                              />
                            </div>
                          </div>
                        </>
                      )
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {Object.keys(el).map(
                      (key, idx) =>
                        key !== "imgSrc" &&
                        key !== "renderImage" && (
                          <TextArea
                            key={key}
                            placeholder={`Текст статьи (${key})`}
                            value={el[key]}
                            id={key}
                            onChange={(e) =>
                              handleArticleTextChange(
                                articleIndex,
                                key,
                                e.target.value
                              )
                            }
                            autoSize={{ minRows: 5.5, maxRows: 6 }}
                            style={{
                              width:
                                windowSize.width < 1460
                                  ? "450px"
                                  : windowSize.width < 1600
                                  ? "520px"
                                  : "600px",
                              marginBottom: "10px",
                            }}
                            className="textarea"
                          />
                        )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {appear ? (
        <div className="button-wrapper">
          <button
            className="delete-button"
            onClick={() => handleDeleteArticle(editArticle.id)}
          >
            Удалить
          </button>
          {removeOrUpdateBtn()}
        </div>
      ) : null}
    </div>
  );
}

export default Library;
