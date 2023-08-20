import { v4 as uuidv4 } from "uuid";

export const testsBlueprint = [
  {
    question: { placeholder: "Питання_UKR", txt: "" },
    answers: [
      { placeholder: "Відповідь_UKR1", txt: "", isCorrectAnswer: false },
      { placeholder: "Відповідь_UKR2", txt: "", isCorrectAnswer: false },
      { placeholder: "Відповідь_UKR3", txt: "", isCorrectAnswer: false },
    ],
  },
  {
    question: { placeholder: "Question_EN", txt: "" },
    answers: [
      { placeholder: "question_1", txt: "", isCorrectAnswer: false },
      { placeholder: "question_2", txt: "", isCorrectAnswer: false },
      { placeholder: "question_3", txt: "", isCorrectAnswer: false },
    ],
  },
  {
    question: { placeholder: "Вопро́с_RU", txt: "" },
    answers: [
      { placeholder: "Ответ_RU1", txt: "", isCorrectAnswer: false },
      { placeholder: "Ответ_RU2", txt: "", isCorrectAnswer: false },
      { placeholder: "Ответ_RU3", txt: "", isCorrectAnswer: false },
    ],
  },
];

export const testConstructor = Array.from({ length: 3 }, () =>
  testsBlueprint.map((blueprint) => ({
    id: uuidv4(),
    question: { ...blueprint.question },
    answers: blueprint.answers.map((answer) => ({ ...answer })),
  }))
);

export const cats = {
  categories: [
    "Полезное питание",
    "ЖКТ",
    "Иммунная система",
    "Проблемы здоровья 21 века",
    "Стресс: механизм и последствия",
    "Женское здоровье",
    "Мужское здоровье",
  ],
  subCategories: {
    "Полезное питание": [
      "Существует ли правильное/полезное питание?",
      "Полезное питание всем и каждому",
      " Особенности питания для спортсменов",
      "Особенности питания при онкологии",
      "Особенности питания при диабете 2 типа",
      "Особенности питания при сердечно - сосудистых заболеваниях",
      "Особенности питания при желчекаменной болезни",
      "Особенности питания при дискенезии желчного пузыря",
      "Особенности питания при язве желудка, гастритах",
      "Особенности питания при ГЭРБ",
      "Особенности питания при СРК и СИБР",
      "Особенности питания при холецистите",
      "Особенности питания при обостренном АИТ",
      "Что такое гликемический индекс и гликемическая нагрузка?",
    ],
    ЖКТ: [
      "Желудочно-кишечный тракт (ЖКТ)",
      "Кишечник",
      "Печень - королева всего тела",
    ],
    "Иммунная система": [
      "Иммунная система",
      "Врожденный иммунитет",
      "Мукозальный иммунитет",
      "Лимфа",
      "Роль кишечника в иммунитете",
    ],
    "Проблемы здоровья 21 века": [
      "Онкология причины",
      "Сердечно-сосудистые заболевания",
      "Аутоиммунные заболевания",
      "Кандидоз",
      "Аллергия",
      "Избыточная масса тела",
    ],
    "Стресс: механизм и последствия": [
      "Что такое стресс с точки зрения биологии",
      "Чем опасен длительный стресс",
      "Бей, беги или замри!",
      "Болезни, порождаемые стрессом",
    ],
    "Женское здоровье": [
      "Женская гормональная система",
      "Женское Либидо",
      "ПМС и болезненные менструации",
      "Эстрогеновая доминантность и эндометриоз",
      "Синдром поликистозных яичников (СПКЯ)",
    ],
    "Мужское здоровье": [
      "Гормональная система мужчины",
      "Тестостерон - двигатель мужчины",
      "Мужское либидо",
      "Эректильная дисфункция",
    ],
    subSubCategory: [
      "Повышенный холестерин",
      "Атеросклероз",
      "Инфаркт миокарда",
      "Тромбоз",
    ],
  },
};