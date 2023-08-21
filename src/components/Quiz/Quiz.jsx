import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { notification, Input } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { testConstructor } from "../../data/index";
import { Quiz as QuizService } from "../../db/Quizs";
import { cats } from "../../data/index";
import "react-toastify/dist/ReactToastify.css";
import "./Quiz.css";

const isDataValid = (data) => {
  for (const block of data) {
    const isValid = block.every(
      (block) =>
        block.question.txt.trim() !== "" &&
        block.answers.every((answer) => answer.txt.trim() !== "")
    );
    if (!isValid) {
      return isValid;
    }
  }
  return true;
};

const Quiz = ({ editQuiz }) => {
  const [api, contextHolder] = notification.useNotification();
  const [questionAnswers, setQuizState] = useState(testConstructor);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [questName, setQuestName] = useState("");
  const onQuestionChange = (blockIndex, questionId, value) => {
    setQuizState((prevState) => {
      const newState = [...prevState];
      const questionBlock = newState[blockIndex].find(
        (el) => el.id === questionId
      );
      if (questionBlock) {
        questionBlock.question.txt = value;
      }
      return newState;
    });
  };
  const updateQuizzes = () => {
    if (Object.keys(editQuiz).length > 0) {
      setQuestName(editQuiz.questName);
      setSelectedCategory(editQuiz.category);
      setQuizState(editQuiz.tests);
      setIsCreating(true);
    }
  };
  useEffect(() => {
    updateQuizzes();
  }, [editQuiz]);

  const onAnswerChange = (blockIndex, questionId, answerIndex, value) => {
    setQuizState((prevState) => {
      const newState = [...prevState];
      const questionBlock = newState[blockIndex].find(
        (el) => el.id === questionId
      );
      if (questionBlock) {
        questionBlock.answers[answerIndex].txt = value;
      }
      return newState;
    });
  };

  const onCheckboxChange = (blockIndex, _, answerIndex) => {
    setQuizState((prevState) => {
      const newState = [...prevState];

      if (newState[blockIndex]) {
        newState[blockIndex].forEach(
          (el) =>
            (el.answers[answerIndex].isCorrectAnswer =
              !el.answers[answerIndex].isCorrectAnswer)
        );
      }
      return newState;
    });
  };
  const handleQuestName = (e) => {
    return setQuestName(e.target.value);
  };

  const onHandleSave = async () => {
    const isValid = isDataValid(questionAnswers);
    if (!selectedCategory || !isValid) {
      return toast.error("пожалуйста заполните все необходимые поля", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    const tests = JSON.stringify(questionAnswers);
    const quizService = new QuizService({ tests, selectedCategory, questName });

    await quizService.createQuiz();
    toast("🦄 тест сдан успешно", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const handleDeleteQuiz = async (id) => {
    const quiz = new QuizService({});
    try {
      const res = await quiz.deleteQuizById(id);
      return api.open({
        message: "Congrats your Quiz removed correctly 🤩",
        description: `Your Quiz item removed successfully`,
        icon: <SmileOutlined style={{ color: "#108ee9" }} fill="#108ee9" />,
      });
    } catch (error) {
      api.open({
        message: "Oops something went wrong 🥴",
        description:
          "try again or contact your sys administrator to solve problem",
      });
      console.log(error);
    }
  };

  const handleUpdateQuiz = async (id) => {
    const tests = JSON.stringify(questionAnswers);

    const quiz = new QuizService({ tests, selectedCategory, questName });
    try {
      const res = await quiz.updateQuizById(id);
      return api.open({
        message: "Congrats your Quiz updated correctly 🤩",
        description: `Your Quiz item updated successfully`,
        icon: <SmileOutlined style={{ color: "#108ee9" }} fill="#108ee9" />,
      });
    } catch (error) {
      api.open({
        message: "Oops something went wrong 🥴",
        description:
          "try again or contact your sys administrator to solve problem",
      });
      console.log(error);
    }
  };

  const removeOrUpdateBtn = () => {
    if (Object.keys(editQuiz).length > 0) {
      return (
        <button
          className="update-button"
          onClick={() => handleUpdateQuiz(editQuiz.id)}
        >
          обновлять
        </button>
      );
    } else {
      return (
        <button className="create-button" onClick={() => onHandleSave()}>
          Опубликовать
        </button>
      );
    }
  };

  return (
    <div className="quiz-wrapper">
      <ToastContainer />
      <div className="quiz-header">
        <div className="quiz-header-block1">
          <span>Создание минитестов</span>
          <button onClick={() => setIsCreating((prevState) => !prevState)}>
            Создать новый минитест
          </button>
        </div>
        <hr className="header-line-separator" />
        <div className="quiz-header-block2">
          {isCreating ? (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option disabled value="">
                Выберите категорию
              </option>
              {cats.categories.map((element, index) => (
                <option key={`category-${index}`} value={element}>
                  {element}
                </option>
              ))}
            </select>
          ) : null}
          {isCreating && (
            <input
              type="text"
              placeholder="Тест имени"
              className="nameInput"
              onChange={handleQuestName}
              value={questName}
            />
          )}
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "70vh",
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {isCreating
          ? questionAnswers.map((blocks, blockIndex) => (
              <div key={`block-${blockIndex}`} className="quiz-block-wrapper">
                <div className="questions-block-wrapper">
                  {blocks.map((block, questionIndex) => (
                    <input
                      type="text"
                      placeholder={block.question.placeholder}
                      key={`question-${block.id}`}
                      onChange={(e) =>
                        onQuestionChange(blockIndex, block.id, e.target.value)
                      }
                      value={block.question.txt}
                    />
                  ))}
                </div>
                <div className="answers-block-wrapper">
                  <div className="radio-wrapper">
                    {blocks[blockIndex].answers.map((answer, answerIndex) => (
                      <input
                        type="checkbox"
                        key={`checkbox-${answerIndex}`}
                        checked={answer.isCorrectAnswer}
                        onChange={() =>
                          onCheckboxChange(
                            blockIndex,
                            blocks[blockIndex].id,
                            answerIndex
                          )
                        }
                      />
                    ))}
                  </div>
                  {blocks.map((block) => (
                    <div key={`answers-${block.id}`} className="answer-inputs">
                      {block.answers.map((answer, answerIndex) => (
                        <input
                          type="text"
                          placeholder={answer.placeholder}
                          key={`answer-${block.id}-${answerIndex}`}
                          onChange={(e) =>
                            onAnswerChange(
                              blockIndex,
                              block.id,
                              answerIndex,
                              e.target.value
                            )
                          }
                          value={answer.txt}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))
          : null}
      </div>

      {isCreating ? (
        <div className="button-wrapper">
          <button
            className="delete-button"
            onClick={() => handleDeleteQuiz(editQuiz.id)}
          >
            Удалить
          </button>
          {removeOrUpdateBtn()}
        </div>
      ) : null}
    </div>
  );
};

export default Quiz;
