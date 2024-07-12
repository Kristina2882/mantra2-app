import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBw0MYSMpbcZeT_INPHpusXgUmuDF88V6o",
    authDomain: "mantra2-app.firebaseapp.com",
    projectId: "mantra2-app",
    storageBucket: "mantra2-app.appspot.com",
    messagingSenderId: "484377569085",
    appId: "1:484377569085:web:add3c24bde5146cf494754"
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;