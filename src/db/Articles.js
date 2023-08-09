import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  limit,
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
        articles.push(doc.data());
      });

      return articles;
    } catch (error) {
      console.error("Error fetching articles: ", error);
      throw error;
    }
  }
}

export default Articles;
