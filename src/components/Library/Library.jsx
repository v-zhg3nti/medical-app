import React, { useState } from "react";
import { notification, Input } from "antd";
import { SmileOutlined } from "@ant-design/icons";

import Articles from "../../db/Articles";

import "./Library.css";

const { TextArea } = Input;

const articleBluePrint = [
  { id: "en", text: "", imgSrc: "" },
  { id: "ru", text: "", imgSrc: "" },
  { id: "uk", text: "", imgSrc: "" },
];

const categoriesBlueprint = [
  ["something", "something2", "something3"],
  ["something4", "something5", "something6"],
  ["something7", "something8", "something9"],
];

const headersBluePrint = [
  { id: "ru", txt: "" },
  { id: "en", txt: "" },
  { id: "uk", txt: "" },
];

function Library() {
  const [api, contextHolder] = notification.useNotification();
  const [articles, setArticles] = useState(articleBluePrint);
  const [categories, _] = useState(categoriesBlueprint);
  const [headers, setHeaders] = useState(headersBluePrint);
  const [selectedImage, setSelectedImage] = useState(null);

  const [appear, setAppear] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(["", "", ""]);

  const handleCategoryChange = (index, value) => {
    const newSelectedCategories = [...selectedCategories];
    newSelectedCategories[index] = value;
    setSelectedCategories(newSelectedCategories);
  };

  const onHeadersChange = (id, value) => {
    const newHeaders = [...headers];
    const element = newHeaders.find((el) => el.id === id);
    element.txt = value;
    setHeaders(newHeaders);
  };

  const handleArticleTextChange = (index, value) => {
    const newArticles = [...articles];
    newArticles[index].text = value;
    setArticles(newArticles);
  };

  const handleImgLinkChange = (value) => {
    setSelectedImage(value);
    const newArticles = articles.map((article) => ({
      ...article,
      imgSrc: value,
    }));
    setArticles(newArticles);
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
        message: "Congrats your article saved correctly 🤩",
        description: `Your article saved successfully with id ${result}`,
        icon: <SmileOutlined style={{ color: "#108ee9" }} fill="#108ee9" />,
      });
    } catch (error) {
      api.open({
        message: "Oops something went wrong 🥴",
        description:
          "try again or contact your sys administrator to solve problem",
      });
      console.error("Error:", error);
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
          </div>
          <div className="library-header-3">
            {headers.map((el) => {
              return (
                <input
                  placeholder={`заголовок_${el.id}`}
                  key={el.id}
                  onChange={(e) => onHeadersChange(el.id, e.target.value)}
                />
              );
            })}
          </div>
          <div className="library-articles">
            {articles.map((el, index) => (
              <div
                key={el.id}
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <div className="library-container-box">
                  <input
                    type="file"
                    onChange={(e) => handleImgLinkChange(e.target.files[0])}
                  />
                  {selectedImage && (
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt={`Article Photo (${el.id})`}
                    />
                  )}
                </div>
                <TextArea
                  placeholder={`Article Text (${el.id})`}
                  value={el.text}
                  onChange={(e) =>
                    handleArticleTextChange(index, e.target.value)
                  }
                  autoSize={{ minRows: 2, maxRows: 6 }}
                />
              </div>
            ))}
            <button
              onClick={() => onArticleSubmit()}
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
          </div>
        </>
      )}
    </div>
  );
}

export default Library;
