import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmQuGHuMS-ea-3OthSCeHXXeLFX5IxHGc",
  authDomain: "myapp-3be3f.firebaseapp.com",
  projectId: "myapp-3be3f",
  storageBucket: "myapp-3be3f.appspot.com",
  messagingSenderId: "1054886895758",
  appId: "1:1054886895758:web:6083f5385d043de8b0e9df"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage }