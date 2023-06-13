import axios from 'axios';
import { useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { loginPath } from '../routes';
import useAuth from '../hooks/useAuth';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

const LoginForm = () => {
  const { logIn, loggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef();

  const f = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const res = await axios.post(loginPath(), values);
        localStorage.setItem('userId', JSON.stringify(res.data));
        logIn();
        const { from } = location.state || { from: { pathname: '/' } };
        navigate(from);
      } catch (err) {
        setSubmitting(false);
        if (err.isAxiosError && err.response.status === 401) {
          setStatus('userUnknown');
          inputRef.current.select();

          return;
        }
        throw err;
      }
    },
  });

  if (loggedIn) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  const isUserUnknownError = f.status === 'userUnknown';

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-4 col-md-6 col-sm-8">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center mb-4">Login</h1>
              <Form onSubmit={f.handleSubmit}>
                <Form.Group controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={f.values.username}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    ref={inputRef}
                    isInvalid={(f.touched.username && f.errors.username) || isUserUnknownError}
                  />
                  <Form.Control.Feedback type="invalid">
                    {isUserUnknownError ? 'userUnknown' : f.errors.username}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={f.values.password}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    isInvalid={(f.touched.password && f.errors.password) || isUserUnknownError}
                  />

                  <Form.Control.Feedback type="invalid">{f.errors.password}</Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center">
                  <Button variant="primary" type="submit" disabled={f.isSubmitting}>
                    Submit
                  </Button>
                  <Link to="/registration">Регистрация</Link>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
