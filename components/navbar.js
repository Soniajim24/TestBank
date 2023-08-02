import * as Bootstrap from 'react-bootstrap';
import React from 'react';
import { UserProvider } from '../components/userContext';

export default function LoggedOutNavbar() {

return(
    <UserProvider>
    <div className="App">
        <header>
            <Bootstrap.Navbar bg="dark" variant="dark">
            <Bootstrap.Container>
                <Bootstrap.Navbar.Brand href="/#" style={{color: '#FF1493'}}>EU´s Bad Bank</Bootstrap.Navbar.Brand>
                    <Bootstrap.Nav className="me-auto">
                        <Bootstrap.Nav.Link href='/'>Home</Bootstrap.Nav.Link>
                        <Bootstrap.Nav.Link href='/createaccount'>Create Account</Bootstrap.Nav.Link>
                        </Bootstrap.Nav>
                        <Bootstrap.Nav className="ml-auto">
                        <Bootstrap.Nav.Link href='/login'>Login</Bootstrap.Nav.Link>
                    </Bootstrap.Nav>
                    </Bootstrap.Container>
            </Bootstrap.Navbar>
        </header> 
</div>
</UserProvider>
)};