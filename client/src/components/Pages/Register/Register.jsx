import { Typography, Button, Box, Link, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { Link as RouteLink, useNavigate } from 'react-router-dom';
import Input from '../../Common/Atoms/Input';
import Auth from '../../Common/Compounds/Auth';
import MoonLoader from 'react-spinners/MoonLoader';
import { useDispatch, useSelector } from 'react-redux';
import { theme } from '../../../theme/muiTheme';
import { useState } from 'react';
import { isValidEmail } from '../../../../utils/HelperMethods';
import toast from 'react-hot-toast';
import { register } from '../../../../context/slices/authSlice';

const Register = () => {
  document.title = 'Health Mark | Register';
  
  /* To manage the state of the form */
  const [formdata, setFormdata] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', role: '' });

  /* 
    To manage the error message, that'll be displayed if any
    error occurs while filling the form 
  */
  const [errorMessage, setErrorMessage] = useState('');

  /* To dispatch the action to register the user */
  const dispatch = useDispatch();

  /* To navigate to the other routes */
  const navigate = useNavigate();

  /* To handle the change in the form data */
  const handleOnChangeFormdata = (e) => {
    if (e.target.name === 'firstName' && (!e.target.value || e.target.value.length < 3))
      setErrorMessage('First Name is required');
    else if (e.target.name === 'lastName' && (!e.target.value || e.target.value.length < 3))
      setErrorMessage('Last Name is required');
    else if (e.target.name === 'email' && !isValidEmail(e.target.value))
      setErrorMessage('Invalid Email');
    else if (e.target.name === 'password' && e.target.value.length < 8)
      setErrorMessage('Password length must be 8.');
    else if (e.target.name === 'confirmPassword' && e.target.value !== formdata.password)
      setErrorMessage('Passwords do not match');
    else if (e.target.name === 'confirmPassword' && e.target.value === formdata.password)
      setErrorMessage('');
    else
      setErrorMessage('');
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  }

  /* To handle the registration of the user */
  const handleRegister = () => {
    if (!formdata.firstName || formdata.firstName.length < 3)
      toast.error('First Name is required');
    else if (!formdata.lastName || formdata.lastName.length < 3)
      toast.error('Last Name is required');
    else if (!isValidEmail(formdata.email))
      toast.error('Invalid Email');
    else if (formdata.password.length < 8)
      toast.error('Password must be atleast 8 characters long');
    else if (formdata.password !== formdata.confirmPassword)
      toast.error('Passwords do not match');
    else if (!formdata.role)
      toast.error('Please select a role');
    else {
      /* Dispatch the register action */
      dispatch(register(formdata))
        .then((resultAction) => {
          if (register.fulfilled.match(resultAction)) {
            const { status, message } = resultAction.payload;
            toast[status === 200 ? 'success' : 'error'](message);
            if (status === 200) {
              navigate('/');
            }
          }
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  }

  return (
    <Auth>
      <Box sx={styles.formBox}>
        <Typography variant='h5' sx={styles.formHeading}>Create an account</Typography>
        {errorMessage && <Typography sx={styles.errorMessage}>{errorMessage}</Typography>}
        {/* First last name, in same row, two different boxes */}
        <Box sx={styles.nameBoxContainer}>
          <Box sx={styles.nameBox}>
            <Input title="First Name" placeholder="First Name" name="firstName" type={'text'} value={formdata.firstName} onChange={handleOnChangeFormdata} />
          </Box>
          <Box sx={styles.nameBox}>
            <Input title="Last Name" placeholder="Last Name" name="lastName" type={'text'} value={formdata.lastName} onChange={handleOnChangeFormdata} />
          </Box>
        </Box>
        <Input title="Email" placeholder="Email" name="email" type={'email'} value={formdata.email} onChange={handleOnChangeFormdata} />
        <Input title="Password" placeholder="Password" name="password" type={'password'} value={formdata.password} onChange={handleOnChangeFormdata} />
        <Input title="Confirm Password" placeholder="Re-enter Password" name="confirmPassword" type={'password'} value={formdata.confirmPassword} onChange={handleOnChangeFormdata} />

        <FormControl sx={{ mt: 2, width: '100%' }}>
          <FormLabel id="demo-radio-buttons-group-label">Sign Up As</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="user"
            name="radio-buttons-group"
            row
            value={formdata.role}
            onChange={(e) => setFormdata({ ...formdata, role: e.target.value })}
          >
            <FormControlLabel value="user" control={<Radio />} label="User" />
            {/* <FormControlLabel value="doctor" control={<Radio />} label="Doctor"/>
            <FormControlLabel value="vendor" control={<Radio />} label="Vendor" /> */}
          </RadioGroup>
        </FormControl>



        <Button variant="contained" size='large' fullWidth sx={styles.button}
          disabled={useSelector(state => state.auth.loading) || (formdata.password !== formdata.confirmPassword) || !isValidEmail(formdata.email) || formdata.password.length < 8}
          onClick={handleRegister}
        >
          {useSelector(state => state.auth.loading) ? <MoonLoader color={theme.palette.primary.main} size={20} /> : 'Register'}
        </Button>
        <Typography sx={styles.registerText}>
          {`Already have an account?`} <Link component={RouteLink} to="/" variant="contained" color="primary" disableelevation="true">
            Login
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
  nameBoxContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  nameBox: {
    display: 'flex',
    flexDirection: 'column',
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

export default Register;
