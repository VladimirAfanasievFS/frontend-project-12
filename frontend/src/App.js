import 'bootstrap';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import Error from './pages/Error';
import useAuth from './hooks/useAuth';
import AuthProvider from './providers/AuthProvider';

const PrivateRoute = () => {
  const auth = useAuth();
  const location = useLocation();
  console.log('🚀 ~ file: App.js:19 ~ PrivateRoute ~ auth.loggedIn:', auth.loggedIn);
  return auth.loggedIn ? <Outlet /> : <Navigate to="/login" state={{ from: location }} />;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="" element={<PrivateRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
