import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA7tsKeb11nY3LZJoqwgs8XPXCQXA24lGA",
  authDomain: "gowda-b35b4.firebaseapp.com",
  projectId: "gowda-b35b4",
  storageBucket: "gowda-b35b4.firebasestorage.app",
  messagingSenderId: "610973380125",
  appId: "1:610973380125:web:57c07f32fc2d5376e060f4",
  measurementId: "G-TLPTP54WFV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;