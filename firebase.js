import { initializeApp } from 'firebase/app'
import { getAuth } from "firebase/auth"
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDuJIaTB_l2QJ4eNppg8PJ3WsYgQ2fTDzc",
  authDomain: "bookslots-b7e1e.firebaseapp.com",
  projectId: "bookslots-b7e1e",
  storageBucket: "bookslots-b7e1e.firebasestorage.app",
  messagingSenderId: "169898694697",
  appId: "1:169898694697:web:f6f989f54e675405ab6438",
  measurementId: "G-SXTSDPC775"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
