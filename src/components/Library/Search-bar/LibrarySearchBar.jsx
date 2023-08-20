import React, { useEffect, useState } from "react";
import Articles from "../../../db/Articles";
import "./LibrarySearchBar.css";
import NoPhoto from "../../../assets/no-photo.jpg";
import { Dropdown, Menu, Button } from "antd";
import chevron from "../../../assets/Vector.svg";
import { cats } from "../../../data";

function LibrarySearchBar({ handleEditArticle }) {
  const [selectedCategories, setSelectedCategories] = useState(["", "", ""]);
  const [categoryApiData, setaCategoryApiData] = useState(null);
  const [categories, setCategories] = useState([
    [...cats.categories],
    [...(cats.subCategories[selectedCategories[1]] || [""])],
  ]);

  useEffect(() => {
    const fetchArticles = async () => {
      const article = new Articles({});

      try {
        const fetchedArticles = await article.searchArticlesByCategories(
          selectedCategories
        );
        console.log("out of if", fetchedArticles);
        if (fetchedArticles.length) {
          setaCategoryApiData(fetchedArticles);
        } else {
          setaCategoryApiData(null);
        }
      } catch (error) {
        console.error("Error fetching articles: ", error);
      }
    };

    fetchArticles();
  }, [selectedCategories]);

  const handleCategoryChange = (index, value) => {
    const newSelectedCategories = [...selectedCategories];
    newSelectedCategories[index] = value;
    if (index === 0) {
      newSelectedCategories[1] = "";
    }
    setSelectedCategories(newSelectedCategories);
    let updatedSubcategories = cats.subCategories[value] || [];
    if (index === 1) {
      updatedSubcategories = cats.subCategories[selectedCategories[0]] || [];
    }
    const newCategories = [...categories];
    newCategories[1] = updatedSubcategories;
    if (value === "Сердечно-сосудистые заболевания") {
      newCategories[2] = cats.subCategories["subSubCategory"];
    }
    setCategories(newCategories);
  };
  const renderArticleText = (articles, headers, id, selectedCategories) => {
    return articles?.map((text, index) => (
      <div className="filter-category" key={index}>
        {headers[index]?.txt !== "" ? (
          <h3>{headers[index]?.txt}</h3>
        ) : (
          <h3>No header</h3>
        )}
        <div className="filter-img">
          {text.imgSrc !== "" ? (
            <img src={text.imgSrc} alt="" />
          ) : (
            <img src={NoPhoto} alt="" />
          )}
        </div>
        <div className="text">
          <p>{text.text}</p>
        </div>
        <button
          onClick={() =>
            handleEditArticle({ articles, headers, id, selectedCategories })
          }
          className="edit-article-button"
        >
          Редактировать
        </button>
      </div>
    ));
  };
  const handleOptionButtonClick = () => {};

  const renderDropdown = (options, index) => {
    const menu = (
      <Menu style={{ backgroundColor: "#eaf9ff" }}>
        {options.map((option, optionIndex) => (
          <Menu.Item
            key={optionIndex}
            style={{
              textAlign: "center",
              border: "1px solid #0084CE",
              borderRadius: "50px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span onClick={() => handleCategoryChange(index, option)}>
                {option}
              </span>
              <Button
                size="small"
                style={{
                  marginLeft: "10px",
                  backgroundColor: "#c7edfc",
                  borderRadius: "10px",
                  border: "none",
                }}
                onClick={() => handleOptionButtonClick(index, option)}
              >
                Btn
              </Button>
            </div>
          </Menu.Item>
        ))}
      </Menu>
    );

    return (
      <Dropdown overlay={menu} style={{ width: "100%" }} trigger={["click"]}>
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
  return (
    <div className="select-category-selects">
      {categories?.map((options, index) => renderDropdown(options, index))}
      <div className="filter-container">
        {categoryApiData !== null ? (
          categoryApiData.map((el) =>
            renderArticleText(
              el.articles,
              el.headers,
              el.id,
              el.selectedCategories
            )
          )
        ) : (
          <span>Нет активных элементов</span>
        )}
      </div>
    </div>
  );
}

export default LibrarySearchBar;
