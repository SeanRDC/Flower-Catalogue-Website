import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA14DvTzf7SvOaXllhVEewvcCg8vzHLedE",
  authDomain: "peony-fa29e.firebaseapp.com",
  projectId: "peony-fa29e",
  storageBucket: "peony-fa29e.firebasestorage.app",
  messagingSenderId: "613641797295",
  appId: "1:613641797295:web:159ee9c38e6e88abc19e5a",
  measurementId: "G-WZX4M7NF2W"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();