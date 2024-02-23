import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAX1vHzwNTJWlgg2W3cvtXNv8XehtqNy-g",
  authDomain: "bank-b6783.firebaseapp.com",
  projectId: "bank-b6783",
  storageBucket: "bank-b6783.appspot.com",
  messagingSenderId: "91957851141",
  appId: "1:91957851141:web:4b7ad5861a7ba40939d86c",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
// export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);

export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
