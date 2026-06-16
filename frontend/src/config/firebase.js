import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBw5pKOPkeGsqncTqDpgVc63D0XBkX2fxU",
  authDomain: "sales-management-8fff4.firebaseapp.com",
  projectId: "sales-management-8fff4",
  storageBucket: "sales-management-8fff4.firebasestorage.app",
  messagingSenderId: "218607975353",
  appId: "1:218607975353:web:683e436058319c5eb39468",
  measurementId: "G-GCKC51KR6T"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
