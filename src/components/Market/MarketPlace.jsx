import React, { useCallback, useEffect, useState } from "react";
import { notification, Input } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import Market from "../../db/Markets";
import "./MarketPlace.css";
import { cats } from "../../data";
const { TextArea } = Input;

const headersBluePrint = [
  { id: "en", txt: "", placeHolder: "Наименование товара RU" },
  { id: "ru", txt: "", placeHolder: "Name of the product EN" },
  { id: "ukr", txt: "", placeHolder: "Найменування товару UA" },
];

const MarketBluePrint = [
  { id: "en", text: "" },
  { id: "ru", text: "" },
  { id: "uk", text: "" },
];

const categories = cats.categories;

const MarketPlace = ({ editItem, setEditItem }) => {
  const [api, contextHolder] = notification.useNotification();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [headers, setHeaders] = useState(headersBluePrint);
  const [uploadImage, setUploadImage] = useState(null);
  const [marketData, setMarketData] = useState(MarketBluePrint);
  const [newMarket, setNewMarket] = useState(false);
  const [update, setUpdate] = useState(false);

  const onHeadersChange = (id, value) => {
    const newHeaders = [...headers];
    const index = newHeaders.findIndex((el) => el.id === id);
    newHeaders[index].txt = value;
    setHeaders(newHeaders);
  };

  useEffect(() => {
    console.log(editItem);
  }, [editItem]);
  const handleImageChange = (value) => {
    setUploadImage(value);
  };

  const updateITem = () => {
    if (Object.keys(editItem).length > 0) {
      setHeaders(editItem.headers);
      setMarketData(editItem.data);
      setNewMarket(true);
    }
  };
  useEffect(() => {
    updateITem();
  }, [editItem]);

  const handleDeleteItemFromFireBase = async (id) => {
    const market = new Market();
    try {
      const res = await market.removeItemFromCollection(id);
      setHeaders(headersBluePrint);
      setMarketData(MarketBluePrint);
      setEditItem({});
      setUploadImage(null);
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
      marketData,
      headers,
      uploadImage,
    };

    const market = new Market(uploadData);

    try {
      const res = await market.updateItem(id);
      setHeaders(headersBluePrint);
      setMarketData(MarketBluePrint);
      setEditItem({});
      setUploadImage(null);

      return api.open({
        message: "Congrats your Market updated correctly 🤩",
        description: `Your Market item updated successfully`,
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

  const handleMarketTextChange = (index, value) => {
    const newmarketData = [...marketData];
    newmarketData[index].text = value;
    setMarketData(newmarketData);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleMarketSave = async (e) => {
    e.preventDefault();
    const uploadData = {
      selectedCategory,
      uploadImage,
      marketData,
      headers,
    };

    const market = new Market(uploadData);

    try {
      const result = await market.saveMarket();
      setHeaders(headersBluePrint);
      setMarketData(MarketBluePrint);

      return api.open({
        message: "Поздравляю, ваш Маркет сохранен правильно 🤩",
        description: `Ваш рынок успешно сохранен с идентификатором ${result}`,
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

  const handleCreateRecept = () => {
    setNewMarket(!newMarket);
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
    <div style={{ width: "100%" }}>
      {contextHolder}
      <div className="market-main-header">
        <span>Создание тозара</span>
        <button className="create-btn" onClick={handleCreateRecept}>
          создать новый товаръ
        </button>
      </div>
      {newMarket && (
        <form
          style={{
            width: "100%",

            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
          onSubmit={handleMarketSave}
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
              {headers?.map((el, ind) => {
                console.log(el);
                return (
                  <div className="inputwrapper">
                    <p style={{ alignSelf: "flex-start", marginLeft: "4px" }}>
                      {el.placeHolder}
                    </p>
                    <input
                      type="text"
                      value={el.txt}
                      onChange={(e) => onHeadersChange(el.id, e.target.value)}
                      placeholder={el.placeHolder}
                      key={ind}
                      className="input"
                    />
                  </div>
                );
              })}
            </div>
            <div
              style={{
                width: 400,
                height: 300,
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
                  transform: "translate(-50%,0px)",
                  left: "50%",
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
                    setUploadImage("");
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
            {marketData.map((el, index) => {
              return (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    height: "60vh",
                    overflowX: "hidden",
                    overflowY: "auto",
                  }}
                >
                  <p>Текст рынка {el.id}</p>
                  <TextArea
                    placeholder={`Текст рынка (${el.id})`}
                    value={el.text}
                    onChange={(e) =>
                      handleMarketTextChange(index, e.target.value)
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
};

export default MarketPlace;
