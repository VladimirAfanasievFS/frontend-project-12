import React, { useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';
import { signUpPath } from '../routes';

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
        .required('signup.required')
        .min(3, 'signup.usernameConstraints')
        .max(20, 'signup.usernameConstraints'),

      password: Yup.string().required('signup.required').min(6, 'signup.passMin'),
      confirmPassword: Yup.string().test(
        'confirmPassword',
        'signup.mustMatch',
        (value, context) => value === context.parent.password,
      ),
    }),
    onSubmit: async (values) => {
      f.setStatus('valid');
      try {
        const res = await axios.post(signUpPath(), values);
        logIn({ token: res.data.token, username: res.data.username });
        const { from } = location.state || { from: { pathname: '/' } };
        navigate(from);
      } catch (err) {
        if (err.response.status === 409) {
          f.setStatus('userExisted');
          inputRef.current.select();
          return;
        }
        if (err.isAxiosError) {
          toast.error(t('error.networks'));
        }
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
                    placeholder={t('signup.username')}
                    value={f.values.username}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    ref={inputRef}
                    isInvalid={(f.touched.username && f.errors.username) || isUserExistedError}
                  />

                  <Form.Control.Feedback type="invalid">
                    {isUserExistedError ? 'userExisted' : t(f.errors.username)}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="password">
                  <Form.Label>{t('signup.password')}</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder={t('signup.password')}
                    value={f.values.password}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    isInvalid={(f.touched.password && f.errors.password) || isUserExistedError}
                  />

                  <Form.Control.Feedback type="invalid">
                    {t(f.errors.password)}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="confirmPassword" hasValidation>
                  <Form.Label>
                    {' '}
                    {t('signup.confirm')}
                  </Form.Label>
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
                    {t(f.errors.confirmPassword)}
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
