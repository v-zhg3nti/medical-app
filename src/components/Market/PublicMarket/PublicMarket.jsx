import "./PublicMarket.css";
import React, { useState, useEffect } from "react";
import Market from "../../../db/Markets";
const categories = ["test", "test2", "test3", "test4", "test5"];

const PublicMarket = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    const fetchMarket = async () => {
      const market = new Market({});

      try {
        const fetchedMarket = await market.getMarketByCategory(
          selectedCategory
        );
        console.log(
          "🚀 ~ file: PublicMarket.jsx:19 ~ fetchMarket ~ fetchedMarket:",
          fetchedMarket
        );

        setApiData(fetchedMarket);
      } catch (error) {
        console.error("Error fetching recipes: ", error);
      }
    };

    fetchMarket();
  }, [selectedCategory]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  return (
    <div className="market-wrapper">
      <div className="market-header">
        <h2>Общедоступная торговая площадка</h2>
        <select className="select" onChange={handleCategoryChange}>
          {categories.map((option) => (
            <option key={option} className="option">
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="market-body">
        {apiData.length > 0 ? (
          apiData.map((market, index) => (
            <div key={index} className="market-item">
              <h3>{market.category}</h3>
              <img src={market.image} alt={market.category} className="image" />
              {market.data.map((data, index) => (
                <div key={index}>{data.id === "en" && <p>{data.text}</p>}</div>
              ))}
              <button className="edit-button">редактировать</button>
            </div>
          ))
        ) : (
          <p>Нет активных элементов</p>
        )}
      </div>
    </div>
  );
};

export default PublicMarket;
