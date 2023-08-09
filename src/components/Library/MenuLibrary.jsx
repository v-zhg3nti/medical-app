import React from "react";
import "./MenuLibrary.css";
import LibrarySearchBar from "./Search-bar/LibrarySearchBar";

const MenuLibrary = () => {
 

  return (
    <>
      <div className="select-category">
        <h2>опубликованные статьи</h2>
        <LibrarySearchBar/>
      </div>
    
    </>
  );
};

export default MenuLibrary;
