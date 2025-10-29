// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsBSlLx2xJim4vSh3pAT6t5oaGzeY4ZWc",
  authDomain: "catalogmenu-640e4.firebaseapp.com",
  projectId: "catalogmenu-640e4",
  storageBucket: "catalogmenu-640e4.firebasestorage.app",
  messagingSenderId: "351313205315",
  appId: "1:351313205315:web:9cb483561291c9984f9cf6",
  measurementId: "G-DNJR7W3VCC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
