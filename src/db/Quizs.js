import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

class Quiz {
  #collectionName = "quizzes";

  constructor(quizData) {
    this.quizData = quizData || null;
  }

  async createQuiz() {
    try {
      const { tests, selectedCategory: category, questName } = this.quizData;

      await addDoc(collection(db, this.#collectionName), {
        tests,
        category,
        questName,
      });

      return true;
    } catch (error) {
      console.log("error: ", error);
      throw error;
    }
  }

  async getQuizByCategory(category) {
    const quizRef = collection(db, this.#collectionName);
    const queryRef = query(quizRef, where("category", "==", category));
    const querySnapshot = await getDocs(queryRef);

    const quizzes = [];
    querySnapshot.forEach((doc) => {
      const quiz = doc.data();
      quiz.id = doc.id;
      quizzes.push(quiz);
    });
    return quizzes;
  }

  async updateQuizById(id) {
    try {
      const { tests, selectedCategory: category, questName } = this.quizData;
      console.log(this.quizData);
      const res = await updateDoc(doc(db, this.#collectionName, id), {
        tests,
        category,
        questName,
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteQuizById(id) {
    const res = await deleteDoc(doc(db, this.#collectionName, id));
    return res;
  }
}

export { Quiz };
