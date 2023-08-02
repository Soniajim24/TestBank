// database.js
process.env.DEBUG = 'firebase-admin:*';
const admin = require('firebase-admin');
import initializeApp from "firebase/app";
import { getFirestore, collection, addDoc, doc } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';

const app = initializeApp(firebaseConfig);

// Initialize Firebase Admin SDK with your service account credentials
const serviceAccount = require('./badbank-eb5fc-firebase-adminsdk-s8fp6-1857dd3717.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Access Firestore instance
const db = admin.firestore();

/**
 * Connect to the Firestore database.
 */
async function connectToDatabase() {
  try {
    await db.settings({ ignoreUndefinedProperties: true });
    console.log('Connected to Firestore!');
    
    try {
      const docRef = await addDoc(collection(db, "Bank"), {
        Name: "Klaus",
        Email: "klaus@mit.edu",
        Password: "secret11",
        Balance: "100",
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  } catch (error) {
    console.error('Error connecting to Firestore:', error);
    throw error; // Rethrow the error to be caught in the caller
  }
}

module.exports = connectToDatabase;
