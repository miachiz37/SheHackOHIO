// Import the functions you need from the SDKs you need
//copies from firebase setup instructions
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAT2I6hyDrDmYtinQ1Tcre9lGWC4Qa-pqE",
  authDomain: "pantrypalfoodcompanion.firebaseapp.com",
  projectId: "pantrypalfoodcompanion",
  storageBucket: "pantrypalfoodcompanion.appspot.com",
  messagingSenderId: "658772088923",
  appId: "1:658772088923:web:0002e59e976261c124077e",
  measurementId: "G-X5X2WTSNKT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
