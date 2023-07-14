import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
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
  apiKey: API_KEY.toString(),
  authDomain: AUTH_DOMAIN.toString(),
  projectId: PROJECT_ID.toString(),
  storageBucket: STORAGE_BUCKET.toString(),
  messagingSenderId: MESSAGING_SENDER_ID.toString(),
  appId: APP_ID.toString(),
  measurementId: MEASUREMENT_ID.toString(),
};

const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
