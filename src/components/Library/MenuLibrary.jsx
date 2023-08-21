import React from "react";
import "./MenuLibrary.css";
import LibrarySearchBar from "./Search-bar/LibrarySearchBar";

const MenuLibrary = ({ handleEditArticle }) => {
  return (
    <>
      <div className="select-category">
        <LibrarySearchBar handleEditArticle={handleEditArticle} />
      </div>
    </>
  );
};

export default MenuLibrary;
