import React, { useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { signUpPath } from '../routes';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const Registration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logIn } = useAuth();
  const inputRef = useRef();
  const { t } = useTranslation();

  const f = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object().shape({
      username: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be less than 20 characters'),
      password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    }),
    onSubmit: async values => {
      // Отправка данных на сервер или другая логика обработки формы
      f.setStatus('valid');
      try {
        const res = await axios.post(signUpPath(), values);
        localStorage.setItem('userId', JSON.stringify(res.data));
        logIn();
        const { from } = location.state || { from: { pathname: '/' } };
        navigate(from);
      } catch (err) {
        console.log('🚀 ~ file: Login.js:33 ~ onSubmit={ ~ err:', err);
        // setSubmitting(false);
        if (err.response.status === 409) {
          f.setStatus('userExisted');
          inputRef.current.select();
          return;
        }
        if (err.isAxiosError) {
          // setAuthFailed(true);
          // inputRef.current.select();
          return;
        }

        throw err;
      }
    },
  });

  const isUserExistedError = f.status === 'userExisted';
  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-4 col-md-6 col-sm-8">
          <div className="card">
            <div className="card-body">
              <Form onSubmit={f.handleSubmit}>
                <Form.Group controlId="username">
                  <Form.Label>{t('signup.username')}</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={f.values.username}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    ref={inputRef}
                    isInvalid={(f.touched.username && f.errors.username) || isUserExistedError}
                  />

                  <Form.Control.Feedback type="invalid">
                    {isUserExistedError ? 'userExisted' : f.errors.username}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="password">
                  <Form.Label>{t('signup.password')}</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={f.values.password}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    isInvalid={(f.touched.password && f.errors.password) || isUserExistedError}
                  />

                  <Form.Control.Feedback type="invalid">{f.errors.password}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="confirmPassword" hasValidation>
                  <Form.Label> {t('signup.confirm')}</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder={t('signup.confirm')}
                    value={f.values.confirmPassword}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    isInvalid={
                      (f.touched.confirmPassword && f.errors.confirmPassword) || isUserExistedError
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {f.errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit">
                  {t('signup.header')}
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
