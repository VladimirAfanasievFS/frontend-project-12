import 'bootstrap';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import {
  BrowserRouter, Navigate, Outlet, Route, Routes, useLocation,
} from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import { ToastContainer } from 'react-toastify';
import leoProfanity from 'leo-profanity';
import { io } from 'socket.io-client';
import { Provider as RollbarProvider, ErrorBoundary as ErrorBoundaryRollbar, LEVEL_ERROR } from '@rollbar/react';
import Login from './components/Login';
import Error from './components/Error';
import useAuth from './hooks/useAuth';
import AuthProvider from './providers/AuthProvider';
import Navbar from './components/Navbar';
import ChatPage from './components/ChatPage';
import SocketProvider from './providers/SocketProvider';
import Registration from './components/Registration';
import store from './slices/index.js';
import resources from './locales';
import Modal from './components/Modal';
import { chatPagePath, loginPagePath, signupPagePath } from './routes';

const PrivateRoute = () => {
  const auth = useAuth();
  const location = useLocation();
  return auth.isLogged ? <Outlet /> : <Navigate to="/login" state={{ from: location }} />;
};

const App = async () => {
  const ruDict = leoProfanity.getDictionary('ru');
  leoProfanity.add(ruDict);

  const rollbarConfig = {
    enabled: process.env.NODE_ENV === 'production',
    accessToken: process.env.ROLLBAR_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
  };

  const i18n = i18next.createInstance();

  await i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'ru',
  });

  const socket = io('');

  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundaryRollbar
        level={LEVEL_ERROR}
        fallbackUI={<div>Что то пошло не так</div>}
      >
        <I18nextProvider i18n={i18n}>
          <ReduxProvider store={store}>
            <SocketProvider socket={socket}>
              <AuthProvider>
                <BrowserRouter>
                  <Modal />
                  <div className="d-flex flex-column h-100">
                    <Navbar />
                    <Routes>
                      <Route path={loginPagePath()} element={<Login />} />
                      <Route path={signupPagePath()} element={<Registration />} />
                      <Route path="" element={<PrivateRoute />}>
                        <Route path={chatPagePath()} element={<ChatPage />} />
                        <Route path="*" element={<Error />} />
                      </Route>
                    </Routes>
                  </div>
                  <ToastContainer />
                </BrowserRouter>
              </AuthProvider>
            </SocketProvider>
          </ReduxProvider>
        </I18nextProvider>
      </ErrorBoundaryRollbar>
    </RollbarProvider>
  );
};

export default App;
