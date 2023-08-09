import React, { useEffect, useState } from "react";
import Articles from "../../../db/Articles";
import "./LibrarySearchBar.css";
import NoPhoto from "../../../assets/no-photo.jpg";

const categoriesBlueprint = [
  ["something", "something2", "something3"],
  ["something4", "something5", "something6"],
  ["something7", "something8", "something9"],
];

function LibrarySearchBar() {
  const [categories, _] = useState(categoriesBlueprint);
  const [selectedCategories, setSelectedCategories] = useState(["", "", ""]);
  const [categoryApiData, setaCategoryApiData] = useState(null);

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
    setSelectedCategories(newSelectedCategories);
  };

  const renderArticleText = (articles, headers) => {
    return articles.map((text, index) => (
      <div className="filter-category" key={index}>
        {headers[index].txt !== "" ? (
          <h3>{headers[index].txt}</h3>
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
      </div>
    ));
  };

  return (
    <div className="select-category-selects">
      {categories.map((options, index) => (
        <select
          key={index}
          value={selectedCategories[index]}
          onChange={(e) => handleCategoryChange(index, e.target.value)}
        >
          <option value="">Select a category</option>
          {options.map((option, optionIndex) => (
            <option key={optionIndex} value={option}>
              {option}
            </option>
          ))}
        </select>
      ))}
      <div className="filter-container">
        {categoryApiData !== null ? (
          categoryApiData.map((el) =>
            renderArticleText(el.articles, el.headers)
          )
        ) : (
          <span>Нет активных элементов</span>
        )}
      </div>
    </div>
  );
}

export default LibrarySearchBar;
