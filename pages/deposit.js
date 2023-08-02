import React, { useState, useEffect, useContext } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { collection, getFirestore, updateDoc, query, where, getDocs } from 'firebase/firestore';
//import { db } from '../lib/initAuth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import './styles/home.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'firebase/auth';
import { UserContext, UserProvider } from '../components/userContext';
import LoggedInNavbar from '../components/LoggedInNavbar';
import { IconCheck, IconX } from "@tabler/icons-react";
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBkGKbPgKdxpPqP37GyxKXh4hWmWs7L9dE",
  authDomain: "badbank-eb5fc.firebaseapp.com",
  projectId: "badbank-eb5fc",
  storageBucket: "badbank-eb5fc.appspot.com",
  messagingSenderId: "351104453657",
  appId: "1:351104453657:web:b5eb8fe4594c28b1152e88"
};

firebase.initializeApp(firebaseConfig);

// Access the Firestore collection and document
const auth = getAuth();
const user = auth.currentUser;
const firestore = getFirestore();
const db = getFirestore(); // Update this line to use getFirestore()
const BankCollection = collection(db, 'Bank');


function Deposit() {
  const [depositAmount, setDepositAmount] = useState('');
  const [balance, setBalance] = useState(1000);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDeposit = (event) => {
    event.preventDefault();
    if (!isNaN(parseFloat(depositAmount))) {
      if (parseFloat(depositAmount) > 0) {
        setBalance(balance + parseFloat(depositAmount));
        setDepositAmount('');
        setSuccessMessage('Deposit successful!');
        setErrorMessage('');
        
        // Set a timeout to clear the success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

      } else {
        setErrorMessage('Cannot deposit a negative amount');
        setSuccessMessage('');
      }
    } else {
      setErrorMessage('Please enter a valid number');
      setDepositAmount(0); // set amount to 0 before displaying the alert message
      setSuccessMessage('');
    }
    
  };

  return (
    <div className="position-absolute top-50 start-50 translate-middle">
    <Card style={{ width: '24rem', margin: 'auto', marginTop: '2rem', color: 'white', boxShadow: '0 5px 10px rgba(0,0,0,.2)', 
    padding: '1rem', backgroundColor: "#696969", border: '1px solid black'}}>
  <Card.Header className="text-center" style={{ backgroundColor: '#FF1493', color: 'white', fontSize: '1.5rem' }}>Deposit</Card.Header>
  <Card.Body>
        <Card.Title className='text-center mb-4'>
          <p>Current Balance: ${balance.toFixed(2)}</p>
          </Card.Title>
          <Form onSubmit={handleDeposit}>
            <Form.Group controlId="depositAmount">
              <Form.Label>Deposit Amount:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter deposit amount"
                value={depositAmount}
                onChange={(event) => setDepositAmount(event.target.value)}
              />
            </Form.Group>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {successMessage && (
              <Alert variant="success">{successMessage}</Alert>
            )}
             <Button
                className="btn btn-dark mx-auto d-block"
                type='submit'
        
                style={{ marginTop: '1rem' }}
              >
                Deposit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};


/* Set the Global User Context to Deposit Component */
export default function DepositWithContext() {
  return (
          <UserProvider>
             <LoggedInNavbar />
              <Deposit />
          </UserProvider>
  )

  }