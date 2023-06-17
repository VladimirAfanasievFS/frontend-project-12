import { useMemo, useState } from 'react';
import AuthContext from '../contexts/AuthContext';

const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(!!JSON.parse(localStorage.getItem('user'))?.token);
  const [token, setToken] = useState(JSON.parse(localStorage.getItem('user'))?.token || null);
  const [userName, setUsername] = useState(JSON.parse(localStorage.getItem('user'))?.username || null);

  const authContextValue = useMemo(() => {
    const logIn = (data) => {
      localStorage.setItem('user', JSON.stringify({ token: data.token, username: data.username }));
      setUsername(data.username);
      setToken(data.token);
      setIsLogged(true);
    };
    const logOut = () => {
      localStorage.removeItem('user');
      setUsername(null);
      setToken(null);
      setIsLogged(false);
    };

    return {
      token, logIn, logOut, userName, isLogged,
    };
  }, [token, userName, isLogged]);

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};
export default AuthProvider;
