// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {

  apiKey: "AIzaSyD1OII3T89N6EzMe7t6nc4JpJWIFPoIBhI",
  authDomain: "timetracker-d8255.firebaseapp.com",
  projectId: "timetracker-d8255",
  storageBucket: "timetracker-d8255.firebasestorage.app",
  messagingSenderId: "586070192472",
  appId: "1:586070192472:web:0e11eafe64777efa5ab52d"

};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
export const secondaryAuth = getAuth(secondaryApp);