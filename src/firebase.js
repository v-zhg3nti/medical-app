import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCIFonN74bDG__mVmGAXk4xTBReAMxdfzc",
  authDomain: "health-is-all.firebaseapp.com",
  projectId: "health-is-all",
  storageBucket: "health-is-all.appspot.com",
  messagingSenderId: "650042716326",
  appId: "1:650042716326:web:7cca8f55037ad5ab4a4467",
  measurementId: "G-5BSSBR1VBH",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
