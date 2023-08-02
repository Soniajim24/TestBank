import React, {useContext} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { UserProvider, UserContext } from './src/components/userContext';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs } from "firebase/firestore"; 
import { IconCheck, IconX } from "@tabler/icons-react";
const connectToDatabase = require('./database/connectToDatabase');
const express = require('express');
const app = express();

import connectToDatabase from './database';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/initAuth';

var admin = require("firebase-admin");
var serviceAccount = require("path/to/firebase-adminsdk-s8fp6@badbank-eb5fc.iam.gserviceaccount.com.json");
var cors    = require("cors");
var dal    = require("./dal.js"); 


// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkGKbPgKdxpPqP37GyxKXh4hWmWs7L9dE",
  authDomain: "badbank-eb5fc.firebaseapp.com",
  projectId: "badbank-eb5fc",
  storageBucket: "badbank-eb5fc.appspot.com",
  messagingSenderId: "351104453657",
  appId: "1:351104453657:web:b5eb8fe4594c28b1152e88"
};

// Initialize firestore
const firestore = getFirestore();

function getBalance() {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (user) {
    const userEmail = user.email;
  
    if (userEmail) {
      const bankCollectionRef = collection(firestore, 'Bank');
      const q = query(bankCollectionRef, where('Email', '==', userEmail));
  
      getDocs(q)
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const documentSnapshot = querySnapshot.docs[0];
            const documentData = documentSnapshot.data();
            const balance = documentData.Balance;
            console.log('Balance:', balance);
          } else {
            console.log('User document not found');
          }
        })
        .catch((error) => {
          console.error('Error retrieving balance:', error);
        });
    }
  } else {
    console.log('User not logged in');
  }
}

// Initialize Firebase
if (!firebase.apps.length) {
firebase.initializeApp(firebaseConfig);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://badbank-eb5fc-default-rtdb.europe-west1.firebasedatabase.app"
});


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


async function handler(req, res) {
    // Connect to the database
    await connectToDatabase()

    // Perform database operations
    // ...
}

const createUser = async (userData) => {
  try {
    const docRef = await addDoc(collection(db, 'Bank'), userData);
    console.log('Document written with ID:', docRef.id);
    return { id: docRef.id, ...userData };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export default async (req, res) => {
  try {
    await connectToDatabase();
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while creating the user.');
  }
};



app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from the server!' });
});


const querySnapshot = await getDocs(collection(db, "Bank"));
querySnapshot.forEach((doc) => {
  console.log(`${doc.id} => ${doc.data()}`);
});



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <UserProvider>
    <App />
  </UserProvider>
</React.StrictMode>
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
