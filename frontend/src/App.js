import 'bootstrap';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import Error from './pages/Error';
import useAuth from './hooks/useAuth';
import AuthProvider from './providers/AuthProvider';

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  console.log('🚀 ~ file: App.js:20 ~ PrivateRoute ~ auth:', auth);
  const location = useLocation();
  return auth.loggedIn ? children : <Navigate to="/login" state={{ from: location }} />;
};

const App = () => {
  // return 1232;
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route
            path="*"
            element={
              <PrivateRoute>
                {123}
                {/*
                <Route path="/" element={<HomePage />} />
                <Route path="*" element={<Error />} /> */}
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
