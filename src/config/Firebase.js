import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCyZQxaJNDXsnTBIENqMmfkz2FrPYdeNls",
  authDomain: "shoppinessmart.firebaseapp.com",
  projectId: "shoppinessmart",
  storageBucket: "shoppinessmart.appspot.com",
  messagingSenderId: "182522118408",
  appId: "1:182522118408:web:632b4d45f372c0f02b2cbd",
  measurementId: "G-KNFZGGPQTJ",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();