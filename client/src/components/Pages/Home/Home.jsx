import { Grid } from '@mui/material';
import SideBar from '../../Common/Compounds/SideBar';
import HomeBody from '../../Common/Compounds/HomeBody';
import { useState } from 'react';
import UserProfile from '../../Common/Compounds/UserProfile';

const Home = () => {
  document.title = 'Health Mark | Home';
  const [showAddNewProductModal, setShowAddNewProductModal] = useState(false);
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);

  const toggleAddNewProductModal = () => setShowAddNewProductModal(!showAddNewProductModal); 
  const toggleUserProfileModal = () => setShowUserProfileModal(!showUserProfileModal);

  const [modalStatus, setModalStatus] = useState(null);

  return (
    <Grid container sx={styles.root}>
       {!(showUserProfileModal || showAddNewProductModal) && (
        <>
        <SideBar 
          toggleAddNewProductModal={toggleAddNewProductModal}
          toggleUserProfileModal={toggleUserProfileModal}
          setModalStatus={setModalStatus}
        />
        <HomeBody />
        </>
        )}
        {showUserProfileModal && <UserProfile modalStatus={modalStatus} open={showUserProfileModal} callback={toggleUserProfileModal}/>}
    </Grid>
  )
}

const styles = {
  root: {
    height: '100vh',
    maxHeight: '100vh',
    overflowY: 'auto',
  },
}

export default Home;