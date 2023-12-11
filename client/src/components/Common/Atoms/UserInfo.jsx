import { Box, Button, Tooltip } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Person from '@mui/icons-material/Person';
import { theme } from '../../../theme/muiTheme';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { logout } from '../../../../context/slices/authSlice';
import toast from 'react-hot-toast';

const UserInfo = () => {
  /* To get the user's first name and last name from the state */
  const firstName = useSelector(state => state.auth.user?.firstName);
  const lastName = useSelector(state => state.auth.user?.lastName);

  /* To manage the state of the logout button */
  const [open, setOpen] = useState(false);

  /* To dispatch the action to logout the user */
  const dispatch = useDispatch();

  
  /* To handle the logout of the user */
  const handleLogout = () => {
    dispatch(logout())
    .unwrap() 
    .then((resultAction) => {
      if (logout.fulfilled.match(resultAction)) {
        toast.success('Logout successful');
      } else if (logout.rejected.match(resultAction)) {
        toast.error(resultAction.payload);
      }
    })
    .catch((err) => {
      toast.error(err.message);
    })
    .finally(() => {
      setOpen(false);
    });
};

  return (
    <Tooltip title="Profile" placement="right">
      <Box sx={styles.userInfoContainer} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} >
        <Box sx={{ ...styles.logoutBox, display: open ? 'flex' : 'none' }}>
            <Button sx={styles.button} onClick={handleLogout}>
              Logout
            </Button>
        </Box>
        <Box sx={styles.userAvatar}>
          <Person sx={styles.userAvatarIcon} />
        </Box>
        <Box sx={styles.userName}>
          <Box sx={styles.userNameText}>
            {`${firstName} ${lastName}`}
          </Box>
        </Box>
        <KeyboardArrowDownIcon sx={styles.dropdownIcon} />
      </Box>
    </Tooltip>
  );
}

const styles = {
  userInfoContainer: {
    display: 'flex',
    alignItems: 'center',
    height: '60px',
    position: 'relative',
    cursor: 'pointer',
  },
  logoutBox: {
    position: 'absolute',
    top: '100%',
    right: '0px',
    width: '100%',
    height: '100%',
    display: 'flex',
    borderRadius: '6px',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '1',
    padding: '7px 10px',
    backgroundColor: theme.palette.light.main,
    boxShadow: '0px 0px 10px 0px rgba(1,1,1,0.1)',
  },
  button: {
    elevation: 0,
    marginTop: '12px',
    marginBottom: '12px',
    padding: '8px',
    borderRadius: '6px',
    boxShadow: 'none',
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.light.main,
    width: '100%',
    '&:hover': {
      backgroundColor: theme.palette.subtitle.main,
    }
  },
  userAvatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '50%',
    padding: '10px',
  },
  userAvatarIcon: {
    fontSize: '24px',
  },
  userName: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: '12px',
    paddingRight: '12px',
  },
  userNameText: {
    fontWeight: 'bold',
    fontSize: '14px',
  },
  dropdownIcon: {
    fontSize: '18px',
    marginTop: '4px',
    padding: '0px',
  },
}

export default UserInfo;