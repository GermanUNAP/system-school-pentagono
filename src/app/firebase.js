// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js'
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "AIzaSyDeo-OvxX7kRt5ll4kuqfHv2a-h-VZ4ank",
  authDomain: "pentagono-school.firebaseapp.com",
  databaseURL: "https://pentagono-school-default-rtdb.firebaseio.com",
  projectId: "pentagono-school",
  storageBucket: "pentagono-school.appspot.com",
  messagingSenderId: "313835494596",
  appId: "1:313835494596:web:ca1c8cfbcd3e1f25c6bd91",
  measurementId: "G-Y0PHKVYL9E"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);