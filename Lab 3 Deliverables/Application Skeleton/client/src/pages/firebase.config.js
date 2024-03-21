// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNillgfdot6q51Pjz_OGW1HaNxYm_2AUg",
  authDomain: "my-first-proj-85a18.firebaseapp.com",
  projectId: "my-first-proj-85a18",
  storageBucket: "my-first-proj-85a18.appspot.com",
  messagingSenderId: "35012588797",
  appId: "1:35012588797:web:7ab4810643e28968c67a94",
  measurementId: "G-YELP5NZ5HC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
