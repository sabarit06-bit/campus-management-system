import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBHF5H7tKW2mKw0SalLlVsw72mT94BfLwE",
  authDomain: "campusnextgen-acc9f.firebaseapp.com",
  projectId: "campusnextgen-acc9f",
  storageBucket: "campusnextgen-acc9f.firebasestorage.app",
  messagingSenderId: "539931854282",
  appId: "1:539931854282:web:3e3d52a674223462cf7b33",
  measurementId: "G-2XMQN76SEH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
