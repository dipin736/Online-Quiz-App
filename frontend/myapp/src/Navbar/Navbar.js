import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Navbar as BootstrapNavbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <div>
            <BootstrapNavbar bg="warning" data-bs-theme="light">
                <Container>
                    <BootstrapNavbar.Brand >
                    <Nav.Link as={Link} to='/home'> Test App</Nav.Link>
                       </BootstrapNavbar.Brand>
                    <Nav className="ms-auto">
                        {user ? (
                            <>
                                <Nav.Link onClick={logout}>Logout</Nav.Link>
                                <Nav.Link as={Link} to='/profile'>{user.username}</Nav.Link>
                            </>
                        ) : (
                            <>

                                <Nav.Link as={Link} to='/'>Login</Nav.Link>
                                <Nav.Link as={Link} to='/register'>Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Container>
            </BootstrapNavbar>
        </div>
    )
}

export default Navbar;
