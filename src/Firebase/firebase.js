import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBmqIwONX_Z_em7qAO0zSEACW9H7yyQNW0",
  authDomain: "medilink-e7793.firebaseapp.com",
  projectId: "medilink-e7793",
  storageBucket: "medilink-e7793.appspot.com",
  messagingSenderId: "1061676111539",
  appId: "1:1061676111539:web:42a95e1d67985a20ddc2c6"
};

const app = getApps.length?getApp():initializeApp(firebaseConfig);
const db = getFirestore(app);



export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export default db;
