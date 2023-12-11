import { Avatar, Box, Tooltip, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import productIcon from '../../../assets/images/productIcon.png';
import { theme } from '../../../theme/muiTheme';
import { useState } from 'react';
import ProductView from '../Compounds/AddProduct';

const ProductCard = ({ item }) => {
    const { name, description, price, units, category, image, ageRestricted } = item;
    console.log(ageRestricted);
    const [showInDetailModal, setShowInDetailModal] = useState(false);
    const toggleInDetailModal = () => setShowInDetailModal(!showInDetailModal);

    return (
        <>
            <Tooltip title="View Product" placement="right">
            {!showInDetailModal && (
                <Box sx={styles.bodyContentCard} onClick={toggleInDetailModal}>
                    <Avatar alt="dr template" src={image || productIcon} sizes="large" sx={{ width: '36px', height: '36px' }} />
                    <Typography sx={styles.bodyContentCardTitle}>
                        {name}
                    </Typography>
                    <Typography sx={styles.bodyContentCardDescription}>
                        {description.length > 30 ? description.substring(0, 30) + '...' : description}
                    </Typography>
                    <Typography sx={styles.bodyContentCardCategory}>
                        {category}
                    </Typography>
                    <Box sx={styles.bodyContentCardFooter}>
                        <Typography sx={styles.bodyContentCardPrice}>
                            $ {price ? price.toFixed(2) : 0}
                        </Typography>
                        <Typography sx={styles.bodyContentCardUnits}>
                            {units < 1 ? 'Out of Stock' : units > 50 ? 'In Stock' : 'Low Stock'}
                        </Typography>
                    </Box>
                    <Typography sx={styles.bodyContentCardCategory}>
                        {ageRestricted ? '18+ Only' : 'All Ages'}
                    </Typography>
                </Box>
            )}
            </Tooltip>
            {
                showInDetailModal && <ProductView
                    modalStatus={{ type: 'filled', readonly: true, product: item }}
                    open={showInDetailModal}
                    callback={toggleInDetailModal}
                />
            }

        </>
    );
};


ProductCard.propTypes = {
    item: PropTypes.object.isRequired,
}

const styles = {
    bodyContentCard: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '30%',
        height: '200px',
        borderRadius: '4px',
        padding: '10px',
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
    bodyContentCardTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        marginTop: '10px',
    },
    bodyContentCardDescription: {
        fontSize: '13px',
        marginTop: '5px',
    },
    bodyContentCardFooter: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '80%',
        marginTop: '10px',
    },
    bodyContentCardPrice: {
        fontSize: '12px',
        fontWeight: 'bold',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        padding: '4px 7px',
        borderRadius: '4px',
    },
    bodyContentCardUnits: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontSize: '12px',
        fontWeight: 'bold',
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        padding: '4px 7px',
        borderRadius: '4px',
    },
    bodyContentCardCategory: {
        fontSize: '12px',
        color: theme.palette.primary.main,
        marginTop: '5px',
    },

}

export default ProductCard;
