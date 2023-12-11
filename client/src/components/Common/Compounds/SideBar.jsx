/* eslint-disable no-unused-vars */
import { Button, Grid } from '@mui/material';
import UserInfo from '../../Common/Atoms/UserInfo';
import SideBarMenuItem from '../Atoms/SideBarMenuItem';
import { theme } from '../../../theme/muiTheme';
import PropTypes from 'prop-types';
import Person from '@mui/icons-material/Person';
import SideBarCategories from '../Atoms/SideBarCategories';
import LocalHospital from '@mui/icons-material/LocalHospital';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const SideBar = ({ toggleAddNewProductModal, toggleUserProfileModal, setModalStatus}) => {
  const user = useSelector(state => state.auth.user);
  const products = useSelector(state => state.products.products);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const categories = products?.map(product => product.category);
    setCategories([...new Set(categories)]);
  }
  , [products]);

  const handleProfileBtnClick = () => {
    toggleUserProfileModal();
    setModalStatus({type: 'filled', readonly: false, user: user});
  }

  return (
      <Grid item xs={2} sx={styles.sidebarContainer}>
        <UserInfo />
        <Button variant="contained" size='large' fullWidth sx={styles.button} onClick={handleProfileBtnClick}>
            <Person sx={styles.plusIcon}/> {` My Profile`}
        </Button>
        <SideBarMenuItem text={'All Products'} Icon={LocalHospital} color={theme.palette.subtitle.main} callback={() => {}}/>
        <SideBarCategories categories={categories}/>
      </Grid>
  )
}

SideBar.propTypes = {
  toggleAddNewProductModal: PropTypes.func,
  toggleUserProfileModal: PropTypes.func,
  setModalStatus: PropTypes.func,
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