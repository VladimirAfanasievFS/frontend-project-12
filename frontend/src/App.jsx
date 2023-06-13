import 'bootstrap';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Error from './pages/Error';
import useAuth from './hooks/useAuth';
import AuthProvider from './providers/AuthProvider';
import Navbar from './pages/Navbar';
import ChatPage from './pages/ChatPage';
import SocketProvider from './providers/SocketProvider';
import Registration from './pages/Registration';
import store from './slices/index.js';
import { Provider } from 'react-redux';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import resources from './locales';

const PrivateRoute = () => {
  const auth = useAuth();
  const location = useLocation();
  return auth.loggedIn ? <Outlet /> : <Navigate to="/login" state={{ from: location }} />;
};

const App = async () => {
  const i18n = i18next.createInstance();

  await i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'en',
  });

  return (
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <SocketProvider>
          <AuthProvider>
            <BrowserRouter>
              <div className="d-flex flex-column h-100">
                <Navbar />
                <Routes>
                  <Route path="login" element={<Login />} />
                  <Route path="registration" element={<Registration />} />
                  <Route path="" element={<PrivateRoute />}>
                    <Route path="/" element={<ChatPage />} />
                    <Route path="*" element={<Error />} />
                  </Route>
                </Routes>
              </div>
            </BrowserRouter>
          </AuthProvider>
        </SocketProvider>
      </Provider>
    </I18nextProvider>
  );
};

export default App;
