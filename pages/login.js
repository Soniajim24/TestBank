import React, { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext, UserProvider } from '../components/userContext';
import LoggedOutNavbar from '../components/navbar';
import { auth, getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, onAuthStateChanged, signInWithGoogle } from 'firebase/auth';
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Form, Card } from 'react-bootstrap';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Google } from 'grommet-icons';
import { useAuthState } from "react-firebase-hooks/auth";
import { useAuth } from '../components/Authcontext';
import { Button, Container } from '@mantine/core';
import { login } from '../components/loginfunction';

import "firebase/firestore";

export function GoogleButton(props) {
  return <Button leftIcon={<Google color='plain' />} fullWidth="true" variant="default" color="gray" {...props} />;
}

//export const UserContext = createContext();

export function Login() {
  // Initialize the auth object
  const { auth } = useAuth();
  const {user, setUser} = useContext(UserContext);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [msg, setMsg] = useState('');
  const [color, setColor] = useState('');
  const [icon, setIcon] = useState('');
  const [close, setClose] = useState('');
  const ctx = React.useContext(UserContext); 
  const formRef = React.useRef();
  const [show, setShow] = React.useState(true);
  //const [user, loading, error] = useAuthState(auth);
  const [username, setUsername] = useState('');
  const [userToken, setUserToken] = useState("");
  
  const updateUserToken = (token) => {
    setUserToken(token);
  };
  const validateEmail = (email) => {
    // Regular expression for email validation
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

function handleSubmit(e) {
  e.preventDefault();
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

const handleLogin = async () => {
  if (email.trim() === '') {
    setTitle("");
    setMsg('Please enter your email');
    setColor('red');
    setIcon(<IconX />);
    setClose(3000);
    return;
  }

  if (!validateEmail(email)) {
    setTitle("");
    setMsg('Please enter a valid email address');
    setColor('red');
    setIcon(<IconX />);
    setClose(3000);
    return;
  }

  if (password.trim() === '') {
    setTitle("");
    setMsg('Please enter your password');
    setColor('red');
    setIcon(<IconX />);
    setClose(3000);
    return;
  }

  if (password.length < 8) {
    setTitle("");
    setMsg('Password should be at least 8 characters long');
    setColor('red');
    setIcon(<IconX />);
    setClose(3000);
    return;
  }

  try {
    
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    updateUserToken(user);

      // Set the user's name in the state
      setUsername(user.displayName);

    setTimeout(() => {
      router.push('./LoggedInHome');
    }, 3000);
    setTitle("You did great");
    setMsg("Successful Login");
    setColor("green");
    setIcon(<IconCheck />);
    setClose(3000);
  } catch (error) {
    console.log(error.message);
    const errorMessage = error.message;
    const pattern = /Firebase\serror:\s([^:]+)/;
    const matches = pattern.exec(errorMessage);
    const extractedMessage = matches ? matches[1] : errorMessage;

    setTitle("Oops!");
    setMsg(extractedMessage);
    setColor("red");
    setIcon(<IconX />);
    setClose(3000);
  }
};

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // Sign in with Google pop-up
      const result = await signInWithPopup(auth, provider);

      // Access user information from the result
      const { displayName, email } = result.user;
      // You can access the user's name and email here

      // Wait for 3 seconds before redirecting to the Home Page
      setTimeout(() => {
        router.push('/LoggedInHome');
      }, 3000);
      setTitle('You did great');
      setMsg('Successful Login');
      setColor('green');
      setIcon(<IconCheck />);
      setClose(3000);
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
    <UserContext.Provider value={{ userToken, updateUserToken }}>
    <div className="position-absolute top-50 start-50 translate-middle">
      <Card style={{ width: '24rem', margin: 'auto', marginTop: '2rem', color: 'white', 
      boxShadow: '0 5px 10px rgba(0,0,0,.2)', padding: '1rem', backgroundColor: "#696969", border: '1px solid black' }}>
        <Card.Header className="text-center" style={{ backgroundColor: '#FF1493', color: 'white', fontSize: '1.5rem' }}>
          Log in</Card.Header>
        <Card.Body>
          
            Email address<br />
            <input type="input" className="form-control" id="email" placeholder="Enter email" 
            value={email} onChange={e => setEmail(e.currentTarget.value)} /><br />
            Password<br />
            <input type="password" className="form-control" id="password" placeholder="Enter password" 
            value={password} onChange={e => setPassword(e.currentTarget.value)} /><br />
            <button type="submit" className="btn btn-dark mx-auto d-block" bg="darkblue" text="white" onClick={handleLogin} >Log in</button>
          
          <br></br>
          <Container size="xs">
             <GoogleButton mb={10} onClick={handleGoogleLogin}>Continue with Google</GoogleButton> 
          </Container>
          {show ? null : (
            <>
              <h5>Success</h5>
              <button type="button" className="btn btn-primary" onClick={() => setShow(false)}>
                Show Alert
              </button>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
    </UserContext.Provider>

  );
}

export default function LoginPage() {
  const [user, setUser] = useState(null);
  return (
    <div>
      <LoggedOutNavbar />
      <Container>
        <Row className="justify-content-md-center">
          <Col xs lg="6">
            <Login setUser={setUser} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}








