import { useMemo, useState } from 'react';
import AuthContext from '../contexts/AuthContext';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(!!JSON.parse(localStorage.getItem('userId'))?.token);

  const authContextValue = useMemo(() => {
    const logIn = () => setLoggedIn(true);
    const logOut = () => {
      localStorage.removeItem('userId');
      setLoggedIn(false);
    };

    return { loggedIn, logIn, logOut };
  }, [loggedIn]);

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};
export default AuthProvider;
