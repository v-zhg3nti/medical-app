import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db, storage } from "../firebase";
import { generateRandomString } from "../utils";

class Recipe {
  #collectionName = "recipes";

  constructor(recipeData) {
    this.recipeData = recipeData || null;
  }

  async saveRecipe() {
    const { selectedCategory, uploadImage, recipeData } = this.recipeData;

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
      recipes.push(recipe);
    });

    return recipes;
  }
}

export default Recipe;
