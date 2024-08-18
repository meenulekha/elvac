import { initializeApp } from "@firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence, Auth } from 'firebase/auth';
import { getDatabase } from "@firebase/database";
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyBhHyCulqK7dVQlG6wiX2YCQnv3UJBulcc",
    authDomain: "cardiovac-5ca79.firebaseapp.com",
    projectId: "cardiovac-5ca79",
    storageBucket: "cardiovac-5ca79.appspot.com",
    messagingSenderId: "377776578189",
    appId: "1:377776578189:web:135a568f537407eaaf8cc4",
    measurementId: "G-Y89CWGP35H"
};

// Initialize Firebase App
export const FIREBASE_APP = initializeApp(firebaseConfig);

// Initialize Firestore using the Firebase Web SDK
const db = getFirestore(FIREBASE_APP);

// Initialize Realtime Database
const realtimeDb = getDatabase(FIREBASE_APP);

// Initialize Firebase Auth with React Native persistence
let FIREBASE_AUTH: Auth;

try {
    // Check if Auth is already initialized
    FIREBASE_AUTH = getAuth(FIREBASE_APP);
} catch (error) {
    // If not initialized, do it now with React Native persistence
    FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
}

// Export Firestore and Auth instances
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export { db, FIREBASE_AUTH };
