import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import './styles/home.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'firebase/auth';

function Withdraw() {
  const [balance, setBalance] = useState(1000); // initial balance
  const [amount, setAmount] = useState(0); // input field state
  const [successMessage, setSuccessMessage] = useState(null); // success message state
  const [alertMessage, setAlertMessage] = useState(null); // alert message state

  // function to handle form submit
  const handleSubmit = (event) => {
    event.preventDefault();

    // check if input is a valid number
    if (isNaN(amount)) {
      setAlertMessage('Please enter a valid number.');
    } else if (amount <= 0) { // check if input is a positive number
      setAlertMessage('Please enter a positive number.');
    } else if (amount > balance) { // check if input is less than or equal to balance
      setAmount(0); // set amount to 0 before displaying the alert message
      setAlertMessage('Insufficient balance.');
    } else { // withdraw the amount and update balance
      setBalance(balance - amount);
      setSuccessMessage(`You withdrew ${amount}.`);
        // Set a timeout to clear the success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
        
      setAlertMessage(null);
      setAmount(0); // reset input field
    }
  };

  const handleInputChange = (event) => {
    // check if input is a number, if not show alert
    if (isNaN(event.target.value)) {
      setAlertMessage('Please enter a valid number.');
      setAmount(''); // set amount to empty string
    } else {
      setAlertMessage(null);
      setAmount(parseInt(event.target.value));
    }
  };
  

  return (
    <div className="position-absolute top-50 start-50 translate-middle">
    <Card style={{ width: '24rem', margin: 'auto', marginTop: '2rem', color: 'white', boxShadow: '0 5px 10px rgba(0,0,0,.2)', 
    padding: '1rem', backgroundColor: "#696969", border: '1px solid black'}}>
  <Card.Header className="text-center" style={{ backgroundColor: '#FF1493', color: 'white', fontSize: '1.5rem' }}>Withdraw</Card.Header>
  <Card.Body>
    <Card.Title className='text-center mb-4'>Current Balance: ${balance.toFixed(2)}</Card.Title>
    {successMessage && <Alert variant='success'>{successMessage}</Alert>}
    {alertMessage && <Alert variant='danger'>{alertMessage}</Alert>}
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId='formAmount'>
        <Form.Label>Withdraw Amount:</Form.Label>
        <Form.Control type='text' placeholder='Enter amount to withdraw' value={amount} onChange={handleInputChange} />
      </Form.Group>
      <button type="submit" className="btn btn-dark mx-auto d-block" disabled={amount <= 0} style={{ marginTop: '1rem' }}>Withdraw</button>
    </Form>
  </Card.Body>
</Card>
</div>
  );
}

export default Withdraw;
