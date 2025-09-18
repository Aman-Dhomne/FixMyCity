// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6ROfoXAaxQ8jm3pSf9EQiGAL8AfMi7PE",
  authDomain: "fixmycity-e9b09.firebaseapp.com",
  projectId: "fixmycity-e9b09",
  storageBucket: "fixmycity-e9b09.firebasestorage.app",
  messagingSenderId: "32610310231",
  appId: "1:32610310231:web:467bb5da98ba159421eb12",
  measurementId: "G-MMP2RJ3WLM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };