import { Typography, Box, Button } from '@mui/material';
import logo from '../../../assets/images/person.svg';
import PropTypes from 'prop-types';
import { Link as RouteLink, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { theme } from '../../../theme/muiTheme';
import Input from '../../Common/Atoms/Input';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { isValidEmail } from '../../../../utils/HelperMethods';
import { useDispatch } from 'react-redux';
import { sendPasswordResetEmail } from '../../../../context/slices/authSlice';

const SendPasswordResetMail = () => {
  document.title = 'Health Mark | Reset Password';
  const [email, setEmail] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFormSubmit = () => {
    if (!isValidEmail(email))
      toast.error('Please enter a valid email address');
    else
      {
        dispatch(sendPasswordResetEmail(email))
        .unwrap()
        .then((res) => {
          toast.success(res.message);
          setTimeout(() => {
            navigate('/passwordResetInstructions/' + email);
          }
          , 2000);
        }
        )
        .catch((err) => {
          toast.error(err.message);
        }
        )
      }

  }

  return (
    <Box sx={styles.root}>
        <Box sx={styles.content}>
            <Box sx={styles.logo}>
                <img src={logo}/>
            </Box>
            <Typography sx={styles.titleText} variant='h6'>
              Need to reset your password?
            </Typography>
            <Typography sx={styles.bodyText}>
                {`Please enter your registered email.`}
            </Typography>

            <Input title="Email" placeholder="Email" name="email" type={'email'} value={email} onChange={(e) => setEmail(e.target.value)}/>
            
            <Button variant="contained" size='large' fullWidth sx={styles.button} onClick={handleFormSubmit}>
            {`Send me a verification link`}
            </Button>
            <Link component={RouteLink} to="/" variant="contained" color="red" disableelevation="true">
                Back to Login
            </Link>
        </Box>
    </Box>
  );
};

SendPasswordResetMail.propTypes = {
    children: PropTypes.node,
}

const styles = {
  root: {
    height: '100vh',
    backgroundColor: '#F5F7F8',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '30%',
    maxWidth: '400px',
    boxShadow: '0px 0px 10px 0px rgba(1,1,1,0.1)',
    padding: '30px',
    borderRadius: '10px',
  },
  logo: {
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    alignItems:'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    borderRadius: '10px',
  },
  titleText: {
    paddingTop: '12px',
    paddingBottom: '12px',
  },
  bodyText: {
    textAlign: 'center',
    paddingBottom: '12px',
  },
  button: {
    elevation: 0,
    marginTop: '36px',
    marginBottom: '12px',
    padding: '10px',
    borderRadius: '6px',
    boxShadow: 'none',
  },
}

export default SendPasswordResetMail;
