import React from 'react';
import { Button, Navbar as BootstrapNavbar } from 'react-bootstrap';

import { Link } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { logOut, loggedIn } = useAuth();
  const { t } = useTranslation();
  return (
    <BootstrapNavbar bg="white" expand="lg" className="shadow-sm">
      <div className="container">
        <BootstrapNavbar.Brand as={Link} to="/">
          {t('hexletChat')}
        </BootstrapNavbar.Brand>
        {loggedIn && <Button onClick={logOut}>{t('logout')}</Button>}
      </div>
    </BootstrapNavbar>
  );
};

export default Navbar;
