import { Avatar, Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import doctorIcon from '../../../assets/images/doctorIcon.png';
import userIcon from '../../../assets/images/userIcon.png';
import adminIcon from '../../../assets/images/adminIcon.png';
import vendorIcon from '../../../assets/images/vendorIcon.png';
import { theme } from '../../../theme/muiTheme';
import { useState } from 'react';
import UserProfile from '../Compounds/UserProfile';


const UserCard = ({ item }) => {
    const [showInDetailModal, setShowInDetailModal] = useState(false);
    const toggleInDetailModal = () => setShowInDetailModal(!showInDetailModal);

    return (
       
        <>
         {!showInDetailModal && (
            <Box sx={styles.bodyContentCard} onClick={toggleInDetailModal}>
                <Typography sx={styles.role}>
                    {item.role}
                </Typography>
                <Avatar alt="dr template" 
                    src={item.profilePicture || (item.role === 'doctor' ? doctorIcon : item.role === 'user' ? userIcon : item.role === 'admin' ? adminIcon : vendorIcon)}
                    sizes="large" sx={{ width: '80px', height: '80px' }} 
                />
                <Typography sx={styles.bodyContentCardTitle}>
                    {item.firstName} {item.lastName}
                </Typography>
                <Typography sx={styles.bodyContentCardDescription}>
                    {item.bio?.length > 50 ? `${item.bio.substring(0, 50)}...` : item.bio}
                </Typography>
            </Box>
            )}
            {
                showInDetailModal && <UserProfile 
                    modalStatus={{type: 'filled', readonly: true, user: item}}
                    open={showInDetailModal} 
                    callback={toggleInDetailModal}
                />
            }
        </>
      
    )
}

UserCard.propTypes = {
    item: PropTypes.object.isRequired,
}


const styles = {
    bodyContentCard: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '30%',
        height: '200px',
        borderRadius: '8px',
        backgroundColor: '#F5F5F5',
        marginBottom: '20px',
        boxShadow: '0px 0px 4px 0px rgba(3, 3, 3, 0.1)',
        '&:hover': {
            cursor: 'pointer',
            boxShadow: '0px 0px 10px 2px rgba(3, 3, 3, 0.2)',
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
        },
        transition: 'all 0.2s ease-in-out',
    },
    role:{
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontSize: '12px',
        fontWeight: 'bold',
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
        padding: '5px 10px',
        borderRadius: '6px',
    },
    bodyContentCardTitle: {
        fontWeight: 'bold',
        fontSize: '16px',
        marginTop: '10px',
        marginBottom: '10px',
    },
    bodyContentCardDescription: {
        fontSize: '14px',
        textAlign: 'center',
        padding: '0px 10px',
    },
    taglineContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    tagline: {
        fontWeight: 'bold',
        fontSize: '16px',
    },
    viewAllContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    viewAllText: {
        fontWeight: 'bold',
        fontSize: '14px',
        color: theme.palette.primary.main,
        '&:hover': {
            cursor: 'pointer',
            color: theme.palette.primary.dark,
        },
    },
    productCard: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '30%',
        height: '200px',
        borderRadius: '8px',
        backgroundColor: '#F5F5F5',
        marginBottom: '20px',
        boxShadow: '0px 0px 4px 0px rgba(3, 3, 3, 0.1)',
        '&:hover': {
            cursor: 'pointer',
            boxShadow: '0px 0px 10px 2px rgba(3, 3, 3, 0.2)',
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
        },
        transition: 'all 0.2s ease-in-out',
        padding: '10px 20px',
    },
    plusIcon: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontSize: '36px',
        color: theme.palette.alert.main,
        '&:hover': {
            cursor: 'pointer',
            color: theme.palette.primary.dark,
        },
  
    },
    productCardTitle: {
        fontWeight: 'bold',
        fontSize: '16px',
        marginTop: '10px',
        marginBottom: '10px',
        align: 'left',
        width: '100%',
    },
    productCardDescription: {
        fontSize: '14px',
        align: 'left',
        width: '100%',
    },
    productCardFooter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto',
        width: '100%',
        height: '50px',
    },
    productCardFooterPrice: {
        fontWeight: 'bold',
        fontSize: '16px',
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
    },
  }
  
  export default UserCard;
  