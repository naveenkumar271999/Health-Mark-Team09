import { Button, Grid } from '@mui/material';
import UserInfo from '../Atoms/UserInfo';
import PropTypes from 'prop-types';
import Person from '@mui/icons-material/Person';
import LocalHospital from '@mui/icons-material/LocalHospital';
import { useState } from 'react';
import UserProfile from './UserProfile';
import { useSelector } from 'react-redux';
import AddProduct from './AddProduct';

const SideBar = () => {

  const [showProfileViewModal, setShowProfileViewModal] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const toggleProfileViewModal = () => setShowProfileViewModal(!showProfileViewModal);

  const [showAddNewProductModal, setShowAddNewProductModal] = useState(false);
  const toggleAddNewProductModal = () => setShowAddNewProductModal(!showAddNewProductModal);
  const [showAddNewUserModal, setShowAddNewUserModal] = useState(false);
  const toggleAddNewUserModal = () => setShowAddNewUserModal(!showAddNewUserModal);

  return (
    <>
      <Grid item xs={2} sx={styles.sidebarContainer}>
        <UserInfo />
        <Button variant="contained" size='large' fullWidth sx={styles.button} onClick={toggleProfileViewModal}>
          <Person sx={styles.plusIcon} /> {` Admin Profile`}
        </Button>
        <Button variant="outlined" size='sm' fullWidth sx={{marginBottom: '4px' }} onClick={toggleAddNewProductModal}>
          <LocalHospital sx={styles.plusIcon} /> {` Add New Product`}
        </Button>
        <Button variant="outlined" size='sm' fullWidth sx={{ marginBottom: '4px' }} onClick={toggleAddNewUserModal}>
          <Person sx={styles.plusIcon} /> {` Add New User`}
        </Button>

      </Grid>
      {showProfileViewModal && <UserProfile open={showProfileViewModal} callback={toggleProfileViewModal} modalStatus={{ readonly: false, user: user }} />}
      {showAddNewUserModal && <UserProfile open={showAddNewUserModal} callback={toggleAddNewUserModal} modalStatus={{ type: 'empty', readonly: false }} />}
      {showAddNewProductModal && <AddProduct open={showAddNewProductModal} callback={toggleAddNewProductModal} modalStatus={{ type: 'empty', readonly: false }} />}
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
    marginBottom: '4px',
    padding: '8px',
    borderRadius: '4px',
    boxShadow: 'none',
  },
  plusIcon: {
    fontSize: '24px',
    padding: '0px',
    marginRight: '6px',
  },
}

export default SideBar;