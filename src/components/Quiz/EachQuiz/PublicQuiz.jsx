import React, { useEffect, useState } from "react";
import "./PublicQuiz.css";
import { cats } from "../../../data";
import { v4 as uuid4 } from "uuid";
import { Quiz } from "../../../db/Quizs";
import EditIcon from "../../../assets/Group 3867.png";
const categories = cats.categories;

const PublicQuiz = ({ handleEditQuiz }) => {
  const [selectedCategories, setSelectedCategories] = useState(categories[0]);
  const [quizData, setQuizData] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const quiz = new Quiz({});
      try {
        const getQuiz = await quiz.getQuizByCategory(selectedCategories);
        if (!getQuiz) {
          setQuizData([]);
        }
        const newQuizData = getQuiz.map((item) => {
          return { ...item, tests: JSON.parse(item.tests) };
        });
        setQuizData(newQuizData);
      } catch (error) {
        console.log("Error fetching quizes: ", error);
      }
    };
    fetchQuizzes();
  }, [selectedCategories]);
  console.log(quizData);
  return (
    <div className="public-quiz-wrapper">
      <div className="public-select-wrapper">
        <span className="public-header-text">Опубликованные минитесты</span>
        <select className="public-quiz-select">
          {categories.map((item, index) => (
            <option key={uuid4()} value="test">
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="public-quiz-data-wrapper">
        {quizData.map((item) => (
          <div
            onClick={() => handleEditQuiz(item)}
            style={{ background: "#EAF9FF" }}
          >
            <span>{item.questName}</span>
            <img src={EditIcon} alt="edit quest" width={20} height={20} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicQuiz;
