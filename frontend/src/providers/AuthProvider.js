import { useMemo, useState } from 'react';
import AuthContext from '../contexts/AuthContext';

const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(!!JSON.parse(localStorage.getItem('user'))?.token);
  const [token, setToken] = useState(JSON.parse(localStorage.getItem('user'))?.token);
  const [userName, setUsername] = useState(null);

  const authContextValue = useMemo(() => {
    const logIn = (data) => {
      localStorage.setItem('user', JSON.stringify({ token: data.token, username: data.username }));
      setUsername(userName);
      setToken(token);
      setIsLogged(true);
    };
    const logOut = () => {
      localStorage.removeItem('user');
      setIsLogged(false);
    };

    return {
      token, logIn, logOut, userName, isLogged,
    };
  }, [token, userName, isLogged]);

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};
export default AuthProvider;
