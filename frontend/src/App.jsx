import 'bootstrap';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import Error from './pages/Error';
import useAuth from './hooks/useAuth';
import AuthProvider from './providers/AuthProvider';
import Navbar from './pages/Navbar';
import ChatPage from './pages/ChatPage';

const PrivateRoute = () => {
  const auth = useAuth();
  const location = useLocation();
  return auth.loggedIn ? <Outlet /> : <Navigate to="/login" state={{ from: location }} />;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column h-100">
          <Navbar />
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="" element={<PrivateRoute />}>
              <Route path="/" element={<ChatPage />} />
              <Route path="*" element={<Error />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
