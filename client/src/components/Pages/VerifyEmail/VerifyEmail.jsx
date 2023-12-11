import { Typography, Box, Button } from '@mui/material';
import logo from '../../../assets/images/mail.svg';
import PropTypes from 'prop-types';
import { Link as RouteLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { theme } from '../../../theme/muiTheme';

const VerifyEmail = () => {
  document.title = 'Health Mark | Verify Email';
  return (
    <Box sx={styles.root}>
        <Box sx={styles.content}>
            <Box sx={styles.logo}>
                <img src={logo}/>
            </Box>
            <Typography sx={styles.titleText} variant='h6'>
                Verification Sent
            </Typography>
            <Typography sx={styles.bodyText}>
                {`Verification link has been sent to john123@gmail.com.`}
            </Typography>

            <Typography sx={styles.bodyText}>
                {`\nDidn't get them? Please check your spam or junk folder, and if it's not there, please click on the `} 
                <Typography sx={{color: theme.palette.primary.main, display: 'inline'}}>
                    {`'Resend'`}
                </Typography> 
                {` button to have another verification link sent to your email address.`}
            </Typography>
            <Button variant="contained" size='large' fullWidth sx={styles.button}>
            {`I've Verified, Let's Go`}
            </Button>
            <Typography>
                {`Didn't received the instructions? `} 
                <Link component={RouteLink} to="/register" variant="contained" color="red" disableelevation="true">
                    Resend
                </Link>
            </Typography>
            
        </Box>
    </Box>
  );
};

VerifyEmail.propTypes = {
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
    marginTop: '12px',
    marginBottom: '12px',
    padding: '10px',
    borderRadius: '6px',
    boxShadow: 'none',
  },
}

export default VerifyEmail;
