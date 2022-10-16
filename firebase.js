import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDFMbEVipM3v2yJWM_N1UCNkC4Hdydp2Dw",
  authDomain: "osoitekirja-7cfb8.firebaseapp.com",
  projectId: "osoitekirja-7cfb8",
  storageBucket: "osoitekirja-7cfb8.appspot.com",
  messagingSenderId: "190325387439",
  appId: "1:190325387439:web:298227344a053e8604e45a",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
