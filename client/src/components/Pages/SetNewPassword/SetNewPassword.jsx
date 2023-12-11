import { Typography, Box, Button } from '@mui/material';
import logo from '../../../assets/images/lock.svg';
import PropTypes from 'prop-types';
import { theme } from '../../../theme/muiTheme';
import Input from '../../Common/Atoms/Input';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../../../../context/slices/authSlice';

const SetNewPassword = () => {
  document.title = 'Health Mark | Reset Password';
  const {passwordResetToken} = useParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const dispatch = useDispatch();

  const navigate = useNavigate()

  const handleFormSubmit = () => {
    if (formData.password.length < 8) 
      toast.error('Password must be at least 8 characters long');
    else if (formData.password !== formData.confirmPassword)
      toast.error('Passwords do not match');
    else
      {
        dispatch(resetPassword({password: formData.password, passwordResetToken}))
        .unwrap()
        .then((res) => {
          toast.success(res.message);
          setTimeout(() => {
            navigate('/');
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
              Create new Password
            </Typography>
            <Typography sx={styles.bodyText}>
                {`Restore access to your account.`}
            </Typography>

            <Input title="Password" placeholder="Password" name="password" type={'password'} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}/>
            <Input title="Confirm Password" placeholder="Re-enter Password" name="confirmPassword" type={'password'} value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}/>
            
            <Button variant="contained" size='large' fullWidth sx={styles.button} onClick={handleFormSubmit}>
            {`Update Password`}
            </Button>
        </Box>
    </Box>
  );
};

SetNewPassword.propTypes = {
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

export default SetNewPassword;
