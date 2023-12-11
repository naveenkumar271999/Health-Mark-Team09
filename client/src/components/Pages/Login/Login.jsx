import { Typography, Button, Box, Link } from '@mui/material';
import { Link as RouteLink, useNavigate } from 'react-router-dom';
import Input from '../../Common/Atoms/Input'; 
import Auth from '../../Common/Compounds/Auth';
import toast from 'react-hot-toast';
import { login } from '../../../../context/slices/authSlice';
import { useState } from 'react';
import { isValidEmail } from '../../../../utils/HelperMethods';
import MoonLoader from "react-spinners/MoonLoader";
import { theme } from '../../../theme/muiTheme';
import { useDispatch, useSelector } from 'react-redux';

const Login = () => {
  document.title = 'Health Mark | Login';
  /* To manage the state of the form */
  const [formdata, setFormdata] = useState({email: '', password: ''});

  /* 
  To manage the error message, that'll be displayed if any
  error occurs while filling the form 
  */
 const [errorMessage, setErrorMessage] = useState('');
 
 /* To dispatch the action to register the user */
 const dispatch = useDispatch();

  /* To navigate to the other routes */
  const navigate = useNavigate();

  const handleOnChangeFormdata = (e) => {
    if (e.target.name === 'email' && !isValidEmail(e.target.value))
      setErrorMessage('Invalid Email');
    else if (e.target.name === 'password' && e.target.value.length < 8)
      setErrorMessage('Password length must be 8.');
    else
      setErrorMessage('');
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  }

  /* To handle the login of the user */
  const handleLogin = async () => {
    if (!isValidEmail(formdata.email))
      toast.error('Invalid Email');
    else if (formdata.password.length < 8)
      toast.error('Password must be atleast 8 characters long');
    else
    {
      dispatch(login(formdata))
        .then(async (resultAction) => {
          if (login.fulfilled.match(resultAction)) {
            const { status, message, token } = resultAction.payload;
            toast[status === 200 ? 'success' : 'error'](message);
            if (status === 200) {
              navigate('/');
            }
          }
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
      
  }

  return (
    <Auth>
      <Box sx={styles.formBox}>
        <Typography variant='h5' sx={styles.formHeading}>Login to your account</Typography>
        {errorMessage && <Typography sx={styles.errorMessage}>{errorMessage}</Typography>}
          <Input title="Email" placeholder="Email" name="email" type={'email'} value={formdata.email} onChange={handleOnChangeFormdata} />
          <Input title="Password" placeholder="Password" name="password" type={'password'} value={formdata.password} onChange={handleOnChangeFormdata} />
        <Typography sx={styles.forgotPasswordText}>
          <Link component={RouteLink} to="/sendPasswordResetMail" variant="contained" color="primary" disableelevation="true">
            Forgot Password?
          </Link>
        </Typography>
        <Button variant="contained" size='large' fullWidth sx={styles.button} onClick={handleLogin} disabled={useSelector(state => state.auth.loading)}>
          {useSelector(state => state.auth.loading) ? <MoonLoader color={theme.palette.primary.main} size={14} /> : 'Login'}
        </Button>
        <Typography sx={styles.registerText}>
          {`Don't have an account?`} <Link component={RouteLink} to="/register" variant="contained" color="primary" disableelevation="true">
                Register
            </Link>
        </Typography>
      </Box>
      </Auth>
  );
};

const styles = {
  formBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px',
    height: '70%',
    minWidth: '60%',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px 0px rgba(1,1,1,0.1)',
  },
  formHeading: {
    paddingTop: '10px',
    paddingBottom: '20px',
    fontWeight: '500',
    width: '100%',
    textAlign: 'center',
  },
  errorMessage: {
    color: 'red',
    width: 'min(100%, 200px)',
    textAlign: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: '6px',
    padding: '10px',
  },
  button: {
    elevation: 0,
    marginTop: '12px',
    marginBottom: '12px',
    padding: '10px',
    borderRadius: '6px',
    boxShadow: 'none',
  },
  forgotPasswordText: {
    width: '100%',
    textAlign: 'right',
    paddingTop: '4px',
    paddingBottom: '4px',
  },
  registerText: {
    width: '100%',
    textAlign: 'center',
    paddingTop: '4px',
  },
}

export default Login;
