import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
 apiKey: "AIzaSyB3iYTUoTTZiEsG7kB5BUJF_FZakGgZTKI",
  authDomain: "sih1-a5050.firebaseapp.com",
  projectId: "sih1-a5050",
  storageBucket: "sih1-a5050.firebasestorage.app",
  messagingSenderId: "522061758299",
  appId: "1:522061758299:web:ba41af7d56f2b982ec647e",
  measurementId: "G-X00RPW57BK"
};

// Ye code aapke app ko database se jod dega
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);