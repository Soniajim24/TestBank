import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.module.css'
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { UserContext, UserProvider } from '../components/userContext';
import LoggedOutNavbar from '../components/LoggedOutNavbar';
import React, { useState, useEffect, useContext } from 'react';
import { auth } from '../lib/initAuth';
import { getAuth } from 'firebase/auth';
import { IconCheck, IconX } from "@tabler/icons-react";
import {
  createStyles,
} from '@mantine/core';

const useStyles = createStyles((theme) => ({
  full_container: {
    height: `calc(100vh - 60px)`,
    position: 'relative',
    background: 'linear-gradient(20deg, purple, darkslateblue);',
  },

  form_container: {
    width: '50%',
    height: '100%',
    float: 'left',
    position: 'relative',
    [theme.fn.smallerThan('sm')]: {
      width: '100%',
    },
  },

  image_container: {
    width: '50%',
    height: '100%',
    float: 'left',
    background: 'linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url("/images/credit_card1.png") center/cover no-repeat',

    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));


export function Home() {
  const { classes } = useStyles();
  const auth = getAuth();
  const [user, setUser] = useState('');
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in
        setUser(authUser);
      } else {
        // User is signed out
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);


  return (
    <UserProvider>
      <main>
        <Container>
          <Row className="justify-content-center">
            <Col className='text-center'>
              <h1 className='font-weight-light mt-5 typewriter' style={{fontSize: '48px', color: '#FF1493'}}>
                Welcome to EU's Bad Bank
              </h1>
              <p className="mt-4" style={{fontSize: '24px', color: 'info'}}>
                Your savings are in good hands!
              </p>
            </Col>
          </Row>
          <Row className="justify-content-center">
          <Col xs={12} sm={6} md={4}>
              <Card style={{ width: '24rem' } } className='text-center' >
                <Card.Img variant="top" src="https://picsum.photos/id/48/5000/3333" />
                <Card.Body>
                  <Card.Title>Create Account</Card.Title>
                  <Card.Text>
                    Not a client yet? Create an account today!
                  </Card.Text>
                  <Button
                    variant="primary"
                    href="/createaccount/"
                    style={{
                      backgroundColor: "#FF1493",
                      display: "block",
                      margin: "0 auto",
                      boxShadow: "0 5px 10px rgba(0,0,0,.2)",
                      border: "1px solid black",
                      transition: "all 0.3s ease",
                    }}
                    className="hover-button"
                  >
                    Create Account
                  </Button>
                  <style jsx>{`
                    .hover-button:hover {
                      background-color: #ff8dcf;
                      color: black;
                      border: 1px solid #ff8dcf;
                    }
                  `}</style>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Card style={{ width: '24rem' }} className='text-center'>
                <Card.Img variant="" src="https://picsum.photos/id/528/4288/2848" />
                <Card.Body>
                  <Card.Title>Log In</Card.Title>
                  <Card.Text>
                    Already a client? Log in and operate.
                  </Card.Text>
                  <Button
                    variant="primary"
                    href="/login"
                    style={{
                      backgroundColor: "#FF1493",
                      display: "block",
                      margin: "0 auto",
                      boxShadow: "0 5px 10px rgba(0,0,0,.2)",
                      border: "1px solid black",
                      transition: "all 0.3s ease",
                    }}
                    className="hover-button"
                  >
                    Log In
                  </Button>
                  <style jsx>{`
                    .hover-button:hover {
                      background-color: #ff8dcf;
                      color: black;
                      border: 1px solid #ff8dcf;
                    }
                  `}</style>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
      </UserProvider>
    );  
  }

/* Set the Global User Context to Home Component */
export default function HomeWithContext() {
  return (
    <UserProvider>
        <LoggedOutNavbar />
        <Home />
    </UserProvider>
  )
}