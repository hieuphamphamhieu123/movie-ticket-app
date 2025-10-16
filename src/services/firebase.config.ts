// src/services/firebase.config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAHlhDczD4U64G2djQjUg1umdRVSFQ-tTU",
  authDomain: "movie-ticket-app-45316.firebaseapp.com",
  projectId: "movie-ticket-app-45316",
  storageBucket: "movie-ticket-app-45316.firebasestorage.app",
  messagingSenderId: "350416793617",
  appId: "1:350416793617:web:3b718fcacf04479900c1b0"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);