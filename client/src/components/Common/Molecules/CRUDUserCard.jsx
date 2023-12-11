import { Avatar, Box, Tooltip, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import doctorIcon from '../../../assets/images/doctorIcon.png';
import userIcon from '../../../assets/images/userIcon.png';
import adminIcon from '../../../assets/images/adminIcon.png';
import vendorIcon from '../../../assets/images/vendorIcon.png';
import { theme } from '../../../theme/muiTheme';
import { useState } from 'react';
import UserProfile from '../Compounds/UserProfile';

const CRUDUserCard = ({ item }) => {
    const [showInDetailModal, setShowInDetailModal] = useState(false);
    const toggleInDetailModal = () => setShowInDetailModal(!showInDetailModal);

    return (
        <>
            <Tooltip title="Click to View User" placement="top">
            {!showInDetailModal && (
                <Box sx={styles.bodyContentCard} onClick={toggleInDetailModal}>
                    <Avatar alt="dr template"
                        src={item.profilePicture || (item.role === 'doctor' ? doctorIcon : item.role === 'user' ? userIcon : item.role === 'admin' ? adminIcon : vendorIcon)}
                        sizes="large" sx={{ width: '36px', height: '36px' }}
                    />
                    <Typography sx={styles.bodyContentCardTitle}>
                        {item.firstName} {item.lastName}
                    </Typography>
                    <Typography sx={styles.bodyContentCardDescription}>
                        {item.bio?.length > 96 ? `${item.bio.substring(0, 96)}...` : item.bio}
                    </Typography>
                    <Typography sx={styles.role}>
                        {item.role}
                    </Typography>
                </Box>
            )}
            </Tooltip>
            {
                showInDetailModal && <UserProfile
                    modalStatus={{ type: 'filled', readonly: false, user: item }}
                    open={showInDetailModal}
                    callback={toggleInDetailModal}
                />
            }
        </>);
}

CRUDUserCard.propTypes = {
    item: PropTypes.object.isRequired,
}


const styles = {
    bodyContentCard: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        borderRadius: '8px',
        backgroundColor: '#F5F5F5',
        padding: '12px 16px',
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
    bodyContentCardTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        padding: '0 0 0 20px',
        width: '30%',
    },
    bodyContentCardDescription: {
        fontSize: '14px',
        textAlign: 'left',
        width: '60%',
    },
    role: {
        fontSize: '12px',
        fontWeight: 'bold',
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
        padding: '5px 10px',
        borderRadius: '6px',
        width: '10%',
        textAlign: 'center',
    },
}

export default CRUDUserCard;
