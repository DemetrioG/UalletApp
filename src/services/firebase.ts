import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  API_KEY,
  APP_ID,
  AUTH_DOMAIN,
  MEASUREMENT_ID,
  MESSAGING_SENDER_ID,
  PROJECT_ID,
  STORAGE_BUCKET,
} from "@env";

const firebaseConfig = {
  apiKey: "AIzaSyDRDE67-4oPYZN3-jIpKNfTyi2776Mj7Go",
  authDomain: "uallet-65789.firebaseapp.com",
  projectId: "uallet-65789",
  storageBucket: "uallet-65789.appspot.com",
  messagingSenderId: "1000376585",
  appId: "1:1000376585:web:9abac518451c2f65b2abd8",
  measurementId: "G-1W6ETSJ9B1"
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
