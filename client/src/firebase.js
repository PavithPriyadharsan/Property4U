// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "property4u-fbd2b.firebaseapp.com",
  projectId: "property4u-fbd2b",
  storageBucket: "property4u-fbd2b.appspot.com",
  messagingSenderId: "918792830256",
  appId: "1:918792830256:web:d39eebc19e8e1fb9b35cf5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);