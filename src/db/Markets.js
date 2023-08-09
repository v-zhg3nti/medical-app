import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db, storage } from "../firebase";
import { generateRandomString } from "../utils";

class Market {
  #collectionName = "markets";

  constructor(marketData) {
    this.marketData = marketData || null;
  }

  async saveMarket() {
    const { selectedCategory, uploadImage, marketData } = this.marketData;

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
      markets.push(market);
    });

    return markets;
  }
}

export default Market;
