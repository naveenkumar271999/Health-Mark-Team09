import { Avatar, Box, Tooltip, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import productIcon from '../../../assets/images/productIcon.png';
import { theme } from '../../../theme/muiTheme';
import { useState } from 'react';
import ProductView from '../Compounds/AddProduct';

const CRUDProductCard = ({ item }) => {
    const { name, description, price, units, category, image } = item;
    const [showInDetailModal, setShowInDetailModal] = useState(false);

    const toggleInDetailModal = () => setShowInDetailModal(!showInDetailModal);

    return (
        <>
            <Tooltip title="View Product" placement="top">
            {!showInDetailModal && (
                <Box sx={styles.bodyContentCard} onClick={toggleInDetailModal}>
                    <Avatar alt="dr template" src={image || productIcon} sizes="large" sx={styles.avatar} />
                    <Typography sx={styles.bodyContentCardTitle}>
                        {name}
                    </Typography>
                    <Typography sx={styles.bodyContentCardDescription}>
                        {description.length > 56 ? description.substring(0, 56) + '...' : description}
                    </Typography>
                    <Typography sx={styles.bodyContentCardCategory}>
                        {category}
                    </Typography>
                    <Typography sx={styles.bodyContentCardPrice}>
                        $ {price ? price.toFixed(2) : 0}
                    </Typography>
                    <Typography sx={styles.bodyContentCardUnits}>
                        {units} Units
                    </Typography>
                </Box>
            )}
            </Tooltip>
            {
                showInDetailModal && <ProductView
                    modalStatus={{ type: 'filled', readonly: false, product: item }}
                    open={showInDetailModal}
                    callback={toggleInDetailModal}
                />
            }
        </>
    );
};


CRUDProductCard.propTypes = {
    item: PropTypes.object.isRequired,
}

const styles = {
    bodyContentCard: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        borderRadius: '4px',
        padding: '12px 16px',
        backgroundColor: '#F5F5F5',
        color: theme.palette.lightgray.contrastText,
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
    avatar: {
        width: '36px',
        height: '36px',
    },
    bodyContentCardTitle: {
        fontSize: '14px',
        fontWeight: 'bold',
        width: '20%',
        marginLeft: '15px',
    },
    bodyContentCardDescription: {
        fontSize: '13px',
        width: '40%',
        marginLeft: '15px',
    },
    bodyContentCardPrice: {
        fontSize: '12px',
        fontWeight: 'bold',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        padding: '4px 7px',
        borderRadius: '4px',
        width: '10%',
        textAlign: 'center',
        margin: '0 10px 0 0'
    },
    bodyContentCardUnits: {
        fontSize: '12px',
        fontWeight: 'bold',
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        padding: '4px 7px',
        borderRadius: '4px',
        width: '10%',
        textAlign: 'center',
        margin: '0 10px 0 0'
    },
    bodyContentCardCategory: {
        fontSize: '12px',
        fontWeight: 'bold',
        backgroundColor: theme.palette.warning.main,
        color: theme.palette.warning.contrastText,
        padding: '4px 7px',
        borderRadius: '4px',
        width: '10%',
        textAlign: 'center',
        margin: '0 10px 0 0'
    },

}

export default CRUDProductCard;
