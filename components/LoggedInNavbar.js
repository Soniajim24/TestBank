import React, { useContext, useEffect, useState } from 'react';
import { UserContext, UserProvider } from '../components/userContext';
import { db } from '../lib/initAuth';
import * as Bootstrap from 'react-bootstrap';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import firebase from 'firebase/app';
import 'firebase/auth';

import { initializeApp } from 'firebase/app';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBkGKbPgKdxpPqP37GyxKXh4hWmWs7L9dE",
  authDomain: "badbank-eb5fc.firebaseapp.com",
  projectId: "badbank-eb5fc",
  storageBucket: "badbank-eb5fc.appspot.com",
  messagingSenderId: "351104453657",
  appId: "1:351104453657:web:b5eb8fe4594c28b1152e88"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);


export default function LoggedInNavbar() {
  const auth = getAuth();
  const { user, userName, userEmail, setUserName, setUserEmail, updateUserEmail } = useContext(UserContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  console.log('User Email:', userEmail);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userEmail = user.email;
        if (userEmail) {
          const bankCollectionRef = collection(firestore, 'Bank');
          const q = query(bankCollectionRef, where('Email', '==', userEmail));

          try {
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const documentSnapshot = querySnapshot.docs[0];
              const documentData = documentSnapshot.data();
              setUserName(documentData.name);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
          setUserEmail(userEmail);
        }
      }
    });
  }, [auth, firestore, setUserName, setUserEmail]);
  
  const fetchName = async (user) => {
    try {
      // Fetch the user document using the user's UID
      const userDoc = await getDoc(doc(collection(db, 'Bank'), user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setName(userData.name);
      } else {
        console.error('User data not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        updateUserEmail('');
      })
      .catch((error) => {
        console.log('Error signing out:', error);
      });
    onLogout();
  };

  return (
    <UserProvider>
    <div className="App">
    <header>
        <Bootstrap.Navbar bg="dark" variant="dark">
        <Bootstrap.Container>
            <Bootstrap.Navbar.Brand href="/#" style={{color: '#FF1493'}}> EU´s Bad Bank </Bootstrap.Navbar.Brand>
                <Bootstrap.Nav className="me-auto">
                    <Bootstrap.Nav.Link href='/'>Home</Bootstrap.Nav.Link>
                    <Bootstrap.Nav.Link href='/createaccount'>Create Account</Bootstrap.Nav.Link>
                     <Bootstrap.Nav.Link href='/deposit'>Deposit</Bootstrap.Nav.Link>
                    <Bootstrap.Nav.Link href='/withdraw'>Withdraw</Bootstrap.Nav.Link>
                    </Bootstrap.Nav>
                    <Bootstrap.Nav className="ml-auto">
                    <div className="d-flex align-items-center">
                    <span style={{ color: '#FF1493' }}>Logged in as {(userEmail)}</span>
                    <br></br>
                    <Bootstrap.Nav.Link href="/" onClick={handleLogout}>Log out</Bootstrap.Nav.Link>
                    </div>
                    </Bootstrap.Nav>
                </Bootstrap.Container>

        </Bootstrap.Navbar>
    </header> 
</div>
</UserProvider>
)}

