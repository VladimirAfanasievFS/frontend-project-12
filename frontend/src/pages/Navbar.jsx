import React from 'react';
import { Button, Navbar as BootstrapNavbar } from 'react-bootstrap';

import { Link } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { logOut, loggedIn } = useAuth();
  return (
    <BootstrapNavbar bg="white" expand="lg" className="shadow-sm">
      <div className="container">
        <BootstrapNavbar.Brand as={Link} to="/">
          BRAND
        </BootstrapNavbar.Brand>
        {loggedIn && <Button onClick={logOut}>logout</Button>}
      </div>
    </BootstrapNavbar>
  );
};

export default Navbar;
