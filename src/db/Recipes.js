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
import { db, storage } from "../firebase";
import { generateRandomString } from "../utils";

class Recipe {
  #collectionName = "recipes";

  constructor(recipeData) {
    this.recipeData = recipeData || null;
  }

  async saveRecipe() {
    const { selectedCategory, uploadImage, recipeData, headers } =
      this.recipeData;

    let imageUrl = "";
    if (uploadImage) {
      const imageRef = ref(
        storage,
        `recipe_imgs/${generateRandomString(7)}.jpg`
      );
      await uploadBytesResumable(imageRef, uploadImage, {
        contentType: "image/jpeg",
      });
      imageUrl = await getDownloadURL(imageRef);
    }

    const recipeDocRef = await addDoc(collection(db, this.#collectionName), {
      category: selectedCategory,
      image: imageUrl,
      data: recipeData,
      headers: headers,
    });

    return recipeDocRef.id;
  }

  async getRecipesByCategory(category) {
    const recipesRef = collection(db, this.#collectionName);
    const queryRef = query(recipesRef, where("category", "==", category));
    const querySnapshot = await getDocs(queryRef);

    const recipes = [];
    querySnapshot.forEach((doc) => {
      const recipe = doc.data();
      recipe.id = doc.id;
      recipes.push(recipe);
    });

    return recipes;
  }
  async removeItemFromCollection(id) {
    const res = await deleteDoc(doc(db, this.#collectionName, id));
    return res;
  }

  async updateItem(id) {
    const { selectedCategory, recipeData, headers, uploadImage } =
      this.recipeData;

    try {
      let imageUrl = "";
      if (uploadImage) {
        const imageRef = ref(
          storage,
          `goods_imgs/${generateRandomString(7)}.jpg`
        );
        await uploadBytesResumable(imageRef, uploadImage, {
          contentType: "image/jpeg",
        });
        imageUrl = await getDownloadURL(imageRef);
      }

      const res = await updateDoc(doc(db, this.#collectionName, id), {
        category: selectedCategory,
        data: recipeData,
        headers: headers,
        image: imageUrl,
      });

      return res; // Return the result of the update
    } catch (error) {
      console.error("Error updating item:", error);
      throw error; // Rethrow the error to be handled further up the call stack
    }
  }
}

export default Recipe;
