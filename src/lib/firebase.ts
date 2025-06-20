import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA_8E-zXbMAfJFw6QQuceCh864zIVPSAJg",
  authDomain: "gowda-883c2.firebaseapp.com",
  databaseURL: "https://gowda-883c2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "gowda-883c2",
  storageBucket: "gowda-883c2.firebasestorage.app",
  messagingSenderId: "322319914242",
  appId: "1:322319914242:web:8a0b148ac79caf4cb05e1b",
  measurementId: "G-EDF1KHBY38"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;