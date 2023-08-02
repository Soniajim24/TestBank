import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext, UserProvider } from '../components/userContext';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import Card from 'react-bootstrap/Card';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Google } from 'grommet-icons';
import { getFirestore, collection, addDoc, doc, updateDoc, query  } from 'firebase/firestore';
import firebaseConfig from '../firebaseConfig';
//import { auth } from '../lib/initAuth';
//import { auth } from '../firebase';
import LoggedOutNavbar from '../components/LoggedOutNavbar';
import { initializeApp } from 'firebase/app';
import App from '../App';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/auth';
//import { db } from '../lib/initAuth';

// Initialize the Firebase app
if (!firebase.apps.length) {
  try {
      firebase.initializeApp(firebaseConfig)
  } catch (err) {
      console.error("Firebase initialization error raised", err.stack)
  }
}
// Get a reference to the Firestore database

const db = getFirestore(); // Update this line to use getFirestore()
const bankCollectionRef = collection(db, "Bank");
const auth = getAuth(); // Add this line to get the Auth object

export function GoogleButton(props) {
  return <Button leftIcon={<Google color='plain' />} fullWidth="true" variant="default" color="gray" {...props} />;
}

export function CreateAccount() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [balance, setBalance] = useState(0);
  const [title, setTitle] = useState('');
  const [msg, setMsg] = useState('');
  const [color, setColor] = useState('');
  const [icon, setIcon] = useState('');
  const [close, setClose] = useState('');
  const ctx = React.useContext(UserContext); 
  const formRef = React.useRef();
  const [show, setShow] = React.useState(true);
  const [users, setUsers] = useState([]);
  



  const validateEmail = (email) => {
    // Regular expression for email validation
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  function handleSubmit(e) {
    e.preventDefault();
    // Name validation
    if (!name) {
      alert('Please enter your name.');
      return;
    }
    // Email validation
    if (!email) {
      alert('Please enter your email.');
      return;
    }
    // Password validation
    if (password.length < 8) {
      alert('Password should be at least 8 characters long.');
      return;
    }
  }

  function validate(value, field) {
    if (!value) {
      alert(`Please enter your ${field}.`);
      return false;
    }
    return true;
  }  

  function handleCreate(event) {
    console.log(name, email, password);
    if (!validate(name, 'name')) return;
    if (!validate(email, 'email')) return;
    if (!validate(password, 'password')) return;
    ctx.addUser({ name, email, password, balance: 100 });
    setUsers([...users, { name, email, password, balance: 100 }]);
    setName("");
    setEmail("");
    setPassword("");
    setShow(false);

  }

  function clearForm() {
    setName('');
    setEmail('');
    setPassword('');
    setShow(true);
    if (formRef.current) {
      formRef.current.reset();
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
  
    if (name.trim() === '') {
      setMsg('Please enter your name');
      setColor('red');
      setIcon(<IconX />);
      setClose(3000);
      return;
    }
  
    if (email.trim() === '') {
      setMsg('Please enter your email');
      setColor('red');
      setIcon(<IconX />);
      setClose(3000);
      return;
    }
  
    if (!validateEmail(email)) {
      setMsg('Please enter a valid email address');
      setColor('red');
      setIcon(<IconX />);
      setClose(3000);
      return;
    }
  
    if (password.trim() === '') {
      setMsg('Please enter your password');
      setColor('red');
      setIcon(<IconX />);
      setClose(3000);
      return;
    }
  
    if (password.length < 8) {
      setMsg('Password should be at least 8 characters long');
      setColor('red');
      setIcon(<IconX />);
      setClose(3000);
      return;
    }
  
    try {
      // Create the user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth,  email, password);
      const user = userCredential.user;
  
      // Save the user's name to Firebase Authentication
      await updateProfile(user, {
        displayName: name,
      });
  
      // Create a new document in the "Bank" collection for the user
      const collectionRef = collection(db, 'Bank');
      await addDoc(collectionRef, {
        uid: user.uid,
        name: name,
        email: email,
        password: password,
        balance: 0, // Set an initial balance if desired
      });
  
      console.log('User account created successfully');
  
      // Make a POST request to create a new user in the database
      const response = await fetch('./api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name, 
            email,
            password,
            balance,
        }),
      });

      if (response.ok) {
        // Wait for 3 seconds before redirecting to the Home Page
        setTimeout(() => {
          router.push('./LoggedInHome');
        }, 3000);
        setTitle('You did great');
        setMsg('Successful Sign Up');
        setColor('green');
        setIcon(<IconCheck />);
        setClose(3000);
      } else {
        router.push('./LoggedInHome');
        throw new Error('Failed to create user');
      }
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setTitle('Oops!');
        setMsg('Email is already in use. Please choose a different email.');
        setColor('red');
        setIcon(<IconX />);
        setClose(9000);
        alert('You already have an account. Please login.');
      } else {
        console.log(error.message);
        const errorMessage = error.message;
        // Define a regular expression pattern to match the desired portion of the error message
        const pattern = /Firebase: (.*?)(\s*\(.+\))?$/;
        // Use the match() method with the pattern to extract the desired portion
        const matches = pattern.exec(errorMessage);
        const extractedMessage = matches ? matches[1] : 'Unknown error occurred';
        setTitle('Oops!');
        setMsg(extractedMessage);
        setColor('red');
        setIcon(<IconX />);
        setClose(9000);
      }
    }
  };
  

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);

      const { displayName, email } = result.user;

      // Make a POST request to create a new user in the database
      console.log(name, email, password, balance);
      const response = await fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name, // Use the 'name' variable instead of 'displayName'
          email: email,
          password: password,
          balance: 0, // Set the 'balance' field to 0
        }),
      });

      if (response.ok) {
        // Wait for 1 second before redirecting to the Home Page
        setTimeout(() => {
          router.push('/LoggedInHome');
        }, 1000);
        setTitle('You did great');
        setMsg('Successful Sign Up');
        setColor('green');
        setIcon(<IconCheck />);
        setClose(1000);
      } else {
        throw new Error('Failed to create user');
      }
    } catch (error) {
      console.log(error.message);
      const errorMessage = error.message;
      setTitle('Oops!');
      setMsg(errorMessage);
      setColor('red');
      setIcon(<IconX />);
      setClose(9000);
    }
  };

  useEffect(() => {
    if (msg) {
      notifications.show({ title: title, message: msg, color: color, icon: icon, autoClose: close });
    }
  }, [msg]);

  return (
    <div className="position-absolute top-50 start-50 translate-middle">
      <Card style={{ width: '24rem', margin: 'auto', marginTop: '2rem', color: 'white', boxShadow: '0 5px 10px rgba(0,0,0,.2)', padding: '1rem', backgroundColor: "#696969", border: '1px solid black' }}>
        <Card.Header className="text-center" style={{ backgroundColor: '#FF1493', color: 'white', fontSize: '1.5rem' }}>Create Account</Card.Header>
        <Card.Body>
       <form ref={formRef} onSubmit={handleSubmit}>
            Name<br />
            <input type="input" className="form-control" id="name" placeholder="Enter name" value={name} onChange={e => setName(e.currentTarget.value)} /><br />
            Email address<br />
            <input type="input" className="form-control" id="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.currentTarget.value)} /><br />
            Password<br />
            <input type="password" className="form-control" id="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.currentTarget.value)} /><br />
            <button type="submit" className="btn btn-dark mx-auto d-block" bg="darkblue" text="white" onClick={handleSignUp} >Create Account</button>
          </form>
          <br></br>
          <Container size="xs">
             <GoogleButton mb={10} onClick={handleGoogleSignIn}>Continue with Google</GoogleButton> 
          </Container>
          {show ? null : (
            <>
              <h5>Success</h5>
              <button type="submit" className="btn btn-light" onClick={clearForm}>Add another account</button>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
          }       

/* Set the Global User Context to CreateAccount Component */
export default function CreateAccountWithContext() {
  return (
      <UserProvider>
          <LoggedOutNavbar />
          <CreateAccount />
      </UserProvider>
  )
}