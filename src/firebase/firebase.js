// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAqZB-dzZekRx_325RRyZf8YF_qMiu_o2U",
  authDomain: "chatroom-39552.firebaseapp.com",
  projectId: "chatroom-39552",
  databaseURL: "https://chatroom-39552-default-rtdb.firebaseio.com/",
  storageBucket: "chatroom-39552.appspot.com",
  messagingSenderId: "45386439634",
  appId: "1:45386439634:web:12d1792912931265ce460b",
  measurementId: "G-M12S0RC8FP"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);