import React from "react";
import "./MenuLibrary.css";
import LibrarySearchBar from "./Search-bar/LibrarySearchBar";

const MenuLibrary = ({ handleEditArticle }) => {
  return (
    <>
      <div className="select-category">
        <h2>опубликованные статьи</h2>
        <LibrarySearchBar handleEditArticle={handleEditArticle} />
      </div>
    </>
  );
};

export default MenuLibrary;
