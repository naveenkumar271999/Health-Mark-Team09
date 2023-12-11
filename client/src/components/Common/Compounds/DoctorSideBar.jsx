import { Button, Grid } from '@mui/material';
import UserInfo from '../Atoms/UserInfo';
import PropTypes from 'prop-types';
import Person from '@mui/icons-material/Person';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import UserProfile from './UserProfile';

const SideBar = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const toggleProfileModal = () => setShowProfileModal(!showProfileModal);
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <Grid item xs={2} sx={styles.sidebarContainer}>
        <UserInfo />
        <Button variant="contained" size='large' fullWidth sx={styles.button} onClick={toggleProfileModal}>
          <Person sx={styles.plusIcon} /> {` Doctor's Profile`}
        </Button>
      </Grid>

      {showProfileModal && <UserProfile open={showProfileModal} callback={toggleProfileModal} modalStatus={{ readonly: false, user: user }} />}
    </>
  )
}

SideBar.propTypes = {
  callback: PropTypes.func,
}

const styles = {
  sidebarContainer: {
    backgroundColor: '#F5F7F8',
    padding: '10px 16px',
    position: 'fixed',
    width: '100%',
    top: '0px',
    height: '100vh',
    maxHeight: '100vh',
  },
  button: {
    elevation: 0,
    marginTop: '12px',
    marginBottom: '12px',
    padding: '8px',
    borderRadius: '6px',
    boxShadow: 'none',
  },
  plusIcon: {
    fontSize: '24px',
    padding: '0px',
    marginRight: '6px',
  },
}

export default SideBar;