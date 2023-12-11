import { Grid, Typography, Box } from '@mui/material';
import logo from '../../../assets/images/doctorIcon.png';
import PropTypes from 'prop-types';

const Auth = ({children}) => {
  return (
    <Grid container spacing={0} sx={styles.root}>
    <Grid item xs={6} sx={styles.formContainer}>
        {children}
    </Grid>
    <Grid item xs={6} sx={styles.bannerContainer}>
        <div style={styles.bannerImage}></div>
        <Box sx={styles.bannerContent}>
          <Box sx={styles.logoContainer}>
            <Box sx={styles.logo}>
            <img src={logo} width={50} height={50}/>
            </Box>
            <Typography sx={styles.logoText}>Health Mark</Typography>
          </Box>
          <Box sx={styles.taglineContainer}>
            <Typography sx={styles.taglineText}>
              One Platform for doctors, patients and medical stores
            </Typography>
          </Box>
        </Box>
    </Grid>
  </Grid>
  );
};

Auth.propTypes = {
    children: PropTypes.node,
}

const styles = {
  root: {
    height: '100vh',
  },
  formContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    width: '100%',
    height: '100%',
  },
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
  bannerContainer: {
    position: 'relative',
    display: 'flex',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerImage: {
    position: 'absolute',
    zIndex: -1,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#FC5185',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
  },
  bannerContent: {
    display: 'flex',
    flexDirection: 'column',
    width: '80%',
    height: '70%',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  logoContainer:{
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    backgroundColor: '#FFFFFF',
    display: 'flex',
    alignItems:'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    borderRadius: '10px',
  },
  logoText: {
    color: '#fff',
    marginLeft: '10px',
    fontFamily: 'Krona One, sans-serif',
    fontSize: '24px',
  },
  taglineText: {
    color: '#fff',
    marginLeft: '10px',
    fontFamily: 'Krona One, sans-serif',
    fontSize: '2.6rem',
  }

}

export default Auth;
