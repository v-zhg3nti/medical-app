import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  limit,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { generateRandomString } from "../utils";

class Articles {
  #collectionName = "articles";

  constructor(data) {
    this.articles = data.articles || null;
    this.selectedCategories = data.selectedCategories || null;
    this.headers = data.headers || null;
  }

  async saveImages() {
    const uploadPromises = this.articles.map(async (article) => {
      if (article.imgSrc) {
        const imageRef = ref(
          storage,
          `article_imgs/${generateRandomString(7)}.jpg`
        );
        await uploadBytesResumable(imageRef, article.imgSrc, {
          contentType: "image/jpeg",
        });
        const downloadUrl = await getDownloadURL(imageRef);
        return downloadUrl;
      }
    });

    return Promise.all(uploadPromises);
  }

  async saveArticles() {
    try {
      const uploadedImages = await this.saveImages();

      this.articles.forEach((element) => delete element.renderImage);

      const articlesWithImageUrls = this.articles.map((article, index) => ({
        ...article,
        imgSrc: uploadedImages[index] || "",
      }));

      const docRef = await addDoc(collection(db, this.#collectionName), {
        articles: articlesWithImageUrls,
        selectedCategories: this.selectedCategories,
        headers: this.headers,
      });

      return docRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  }

  async searchArticlesByCategories(selectedCategories, limitSize = 10) {
    try {
      const articlesRef = collection(db, this.#collectionName);
      const querySnapshot = await getDocs(
        query(
          articlesRef,
          where("selectedCategories", "array-contains-any", selectedCategories),
          limit(limitSize)
        )
      );

      const articles = [];
      querySnapshot.forEach((doc) => {
        const article = doc.data();
        article.id = doc.id;
        articles.push(article);
      });

      return articles;
    } catch (error) {
      console.error("Error fetching articles: ", error);
      throw error;
    }
  }
  async updateArticlesById(id) {
    try {
      const updateData = {
        articles: this.articles,
        selectedCategories: this.selectedCategories,
        headers: this.headers,
      };
      const res = await updateDoc(
        doc(db, this.#collectionName, id),
        updateData
      );
      return res;
    } catch (error) {
      console.log(error);
    }
  }
  async deleteArticlesById(id) {
    const res = await deleteDoc(doc(db, this.#collectionName, id));
    return res;
  }
}

export default Articles;
