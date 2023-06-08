import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { loginPath } from '../routes';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

const LoginForm = () => {
  const { logIn, loggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loggedIn) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  // const [authFailed, setAuthFailed] = useState(false);
  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-4 col-md-6 col-sm-8">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center mb-4">Login</h1>
              <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={LoginSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  // setAuthFailed(false);

                  try {
                    const res = await axios.post(loginPath(), values);
                    localStorage.setItem('userId', JSON.stringify(res.data));
                    logIn();
                    const { from } = location.state || { from: { pathname: '/' } };
                    navigate(from);
                  } catch (err) {
                    console.log('🚀 ~ file: Login.js:33 ~ onSubmit={ ~ err:', err);
                    setSubmitting(false);
                    if (err.isAxiosError && err.response.status === 401) {
                      // setAuthFailed(true);
                      // inputRef.current.select();
                      return;
                    }
                    throw err;
                  }

                  setSubmitting(false);
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div>
                      <label htmlFor="username">Username</label>
                      <Field type="text" name="username" className="form-control" />
                      <ErrorMessage name="username" component="div" className="text-danger" />
                    </div>
                    <div>
                      <label htmlFor="password">Password</label>
                      <Field type="password" name="password" className="form-control" />
                      <ErrorMessage name="password" component="div" className="text-danger" />
                    </div>
                    <button type="submit" className="btn btn-primary mt-2" disabled={isSubmitting}>
                      Submit
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginForm;
