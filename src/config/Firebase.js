// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCyZQxaJNDXsnTBIENqMmfkz2FrPYdeNls",
    authDomain: "shoppinessmart.firebaseapp.com",
    projectId: "shoppinessmart",
    storageBucket: "shoppinessmart.appspot.com",
    messagingSenderId: "182522118408",
    appId: "1:182522118408:web:632b4d45f372c0f02b2cbd",
    measurementId: "G-KNFZGGPQTJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)
export const google = new GoogleAuthProvider()