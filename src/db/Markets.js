import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { generateRandomString } from "../utils";

class Market {
  #collectionName = "markets";

  constructor(marketData) {
    this.marketData = marketData || null;
  }

  async saveMarket() {
    const { selectedCategory, uploadImage, marketData, headers } =
      this.marketData;

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

    const marketDocRef = await addDoc(collection(db, this.#collectionName), {
      category: selectedCategory,
      image: imageUrl,
      data: marketData,
      headers: headers,
    });

    return marketDocRef.id;
  }

  async getMarketByCategory(category) {
    const marketsRef = collection(db, this.#collectionName);
    const queryRef = query(marketsRef, where("category", "==", category));

    const querySnapshot = await getDocs(queryRef);
    const markets = [];

    querySnapshot.forEach((doc) => {
      const market = doc.data();
      market.id = doc.id;
      markets.push(market);
    });

    return markets;
  }

  async removeItemFromCollection(id) {
    const res = await deleteDoc(doc(db, this.#collectionName, id));
    return res;
  }

  async updateItem(id) {
    const { selectedCategory, marketData, headers } = this.marketData;

    try {
      // Update the document in the "markets" collection with the provided id
      const res = await updateDoc(doc(db, this.#collectionName, id), {
        category: selectedCategory,
        data: marketData,
        headers: headers,
      });

      return res; // Return the result of the update
    } catch (error) {
      console.error("Error updating item:", error);
      throw error; // Rethrow the error to be handled further up the call stack
    }
  }
}

export default Market;
