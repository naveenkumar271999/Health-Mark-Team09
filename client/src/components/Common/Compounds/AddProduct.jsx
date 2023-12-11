import { Box, Grid, IconButton, Typography } from '@mui/material';
import { theme } from '../../../theme/muiTheme';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../Atoms/Input';
import toast from 'react-hot-toast';
import { addProduct, deleteProduct, deleteProductLocally, updateProduct, updateProductLocally } from '../../../../context/slices/productSlice';
import ProductIcon from '@mui/icons-material/ShoppingCart';
import { addItemToCart, addItemToCartLocally } from '../../../../context/slices/cartSlice';
import Remove from '@mui/icons-material/Remove';
import Add from '@mui/icons-material/Add';
import MoonLoader from 'react-spinners/MoonLoader';


/**
 * @param {*} 
 * @param {*} callback: function to close the modal
 * @param {*} modalStatus: object that contains the modal status and its type
 * @returns: ProductView component
 * @description: This component is a modal that allows the user to add a new Product
 */

const ProductView = ({ callback: handleModalOpenClose, modalStatus }) => {
    const [productData, setProductData] = useState(
        useSelector(state => state.products.products).find((product) => product._id === modalStatus.product?._id) ||
        modalStatus.product || {
            name: '',
            description: '',
            price: '',
            units: '',
            category: '',
            vendorID: '',
        });

    const loggedInUser = useSelector(state => state.auth.user);

    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    /* CREATE OR UPDATE PRODUCT */
    const handleSaveProduct = () => {
        if (productData.name === '' || productData.description === '' || productData.price === '' || productData.units === '' || productData.category === '') {
            toast.error('Please fill in all the fields');
            return;
        }
        // if nothing is changed, close the modal
        if (productData.name === modalStatus.product.name && productData.description === modalStatus.product.description && productData.price === modalStatus.product.price && productData.units === modalStatus.product.units && productData.category === modalStatus.product.category) {
            toast.error('No changes detected');
            return;
        }

        setLoading(true);
        dispatch(updateProduct(productData))
            .then((res) => {
                toast[res.payload.status === 200 ? 'success' : 'error'](res.payload.message);
                dispatch(updateProductLocally(productData));
                setLoading(false);
                handleModalOpenClose();
            })
            .catch((error) => {
                toast.error(error.message);
                setLoading(false);
            });
    }

    const [quantity, setQuantity] = useState(1);

    const handleQuantity = (type) => {
        let newQuantity = quantity;
        if (type === 'increment') {
            newQuantity++;
        } else {
            newQuantity--;
        }
        if (newQuantity < 1 || newQuantity > modalStatus.product.units) {
            return;
        }
        setQuantity(newQuantity);
    }

    const handleAddToCart = () => {
        if (quantity < 1 || quantity > modalStatus.product.units) {
            toast.error('Invalid quantity');
            return;
        }

        setLoading(true);
        dispatch(addItemToCart({ ...modalStatus.product, quantity }))
            .then((res) => {
                toast[res.payload.status === 200 ? 'success' : 'error'](res.payload.message);
                dispatch(addItemToCartLocally({ product: modalStatus.product, quantity }));
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error.message);
                setLoading(false);
            });
    }

    const handleDeleteProduct = () => {
        setLoading(true);
        dispatch(deleteProduct(modalStatus.product._id))
            .then((resultAction) => {
                if (deleteProduct.fulfilled.match(resultAction)) {
                    const { status } = resultAction.payload;
                    if (status === 200) {
                        toast.success("Product deleted successfully");
                        dispatch(deleteProductLocally(productData._id));
                        setLoading(false);
                        handleModalOpenClose();
                    } else {
                        toast.error("Product deletion failed");
                        setLoading(false);
                    }
                }
            })
            .catch((error) => {
                toast.error(error.message);
                setLoading(false);
            });
    }

    const handleAddNewProduct = () => {
        if (productData.name === '' || productData.description === '' || productData.price === '' || productData.units === '' || productData.category === '') {
            toast.error('Please fill in all the fields');
            return;
        }

        setLoading(true);
        dispatch(addProduct({ ...productData, vendorID: loggedInUser._id }))
            .then((res) => {
                toast[res.payload.status === 200 ? 'success' : 'error'](res.payload.message);
                setLoading(false);
                handleModalOpenClose();
            })
            .catch((error) => {
                toast.error(error.message);
                setLoading(false);
            });
    }

    return (
        <Grid item xs={12} sx={styles.root}>
            <Box sx={styles.header}>
                <Box onClick={handleModalOpenClose}
                    sx={{ cursor: 'pointer', '&:hover': { opacity: '.5' } }}>
                    <CloseIcon sx={styles.closeIcon} />
                </Box>
                <Typography sx={styles.headerText} onClick={modalStatus.type === 'empty' ? handleAddNewProduct : handleSaveProduct}>
                    {modalStatus.readonly ? '' : 'Save Product'}
                </Typography>
            </Box>


            <Box sx={styles.bodyContainer}>
                {loading &&
                    <Box sx={styles.overlay}>
                        <MoonLoader color={theme.palette.primary.main} loading={loading} size={24} />
                    </Box>
                }

                <Box sx={styles.subHeader}>
                    <ProductIcon sx={{ fontSize: '24px', color: theme.palette.primary.main }} />
                    <Typography sx={{ fontSize: '24px', fontWeight: 'bold', marginLeft: '12px' }}>
                        {modalStatus.product ? modalStatus.product.name : 'Product'}
                    </Typography>
                    <Typography sx={styles.roleText}>
                        {modalStatus.product ? modalStatus.product.category : 'Category'}
                    </Typography>
                </Box>
                {
                    // if role is admin or it matches the vendorID, delete button
                    (modalStatus.type !== 'empty' && loggedInUser.role === 'admin' || loggedInUser._id === modalStatus.product?.vendorID) &&
                    <Box sx={styles.addToCartContainer}>
                        <Box sx={styles.addToCart}>
                            <Typography sx={styles.addToCartText} onClick={handleDeleteProduct}>
                                Delete Product
                            </Typography>
                        </Box>
                    </Box>
                }
                {loggedInUser.role === 'user' &&
                    <Box sx={styles.addToCartContainer}>
                        <Box sx={styles.cartItemQuantity}>
                            <IconButton sx={styles.quantityButton} onClick={() => handleQuantity('decrement')} disabled={quantity === 1}>
                                <Remove />
                            </IconButton>
                            <Typography sx={styles.cartItemQuantityText}>
                                {quantity}
                            </Typography>
                            <IconButton sx={styles.quantityButton} onClick={() => handleQuantity('increment')} disabled={quantity === modalStatus.product.units}>
                                <Add />
                            </IconButton>
                        </Box>
                        <Box sx={styles.addToCart}>
                            <Typography sx={styles.addToCartText} onClick={handleAddToCart}>
                                Add to Cart
                            </Typography>
                        </Box>
                        <Typography sx={styles.cartItemTotal}>
                            $ {(modalStatus.product ? modalStatus.product.price : 0) * quantity}
                        </Typography>
                    </Box>
                }
                <Box sx={styles.dataContainer}>
                    <Box sx={styles.metadataItem}>
                        {/* <Box sx={styles.metadataItem}>
                            <Typography sx={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>Description</Typography>
                            <Typography sx={{ fontSize: '14px', marginBottom: '12px' }}>{modalStatus.product ? modalStatus.product.description : 'Description'}</Typography>
                        </Box> */}
                        <Input title={'Name'} placeholder={'Name'} name={'name'} type={'text'} value={productData.name} onChange={(e) => setProductData({ ...productData, name: e.target.value })} disabled={modalStatus.readonly} />
                    </Box>
                    <Box sx={styles.metadataItem}>
                        <Input title={'Description'} placeholder={'Description'} name={'description'} type={'text'} value={productData.description} onChange={(e) => setProductData({ ...productData, description: e.target.value })} disabled={modalStatus.readonly} />
                    </Box>
                    <Box sx={styles.metadataItem}>
                        <Input title={'Price $'} placeholder={'Price'} name={'price'} type={'number'} value={productData.price} onChange={(e) => setProductData({ ...productData, price: e.target.value })} disabled={modalStatus.readonly} />
                    </Box>
                    <Box sx={styles.metadataItem}>
                        <Input title={'Units'} placeholder={'Units'} name={'units'} type={'number'} value={productData.units} onChange={(e) => setProductData({ ...productData, units: e.target.value })} disabled={modalStatus.readonly} />
                    </Box>
                    <Box sx={styles.metadataItem}>
                        <Input title={'Category'} placeholder={'Category'} name={'category'} type={'text'} value={productData.category} onChange={(e) => setProductData({ ...productData, category: e.target.value })} disabled={modalStatus.readonly} />
                    </Box>
                    <Box sx={styles.metadataItem} hidden>
                        <Input title={'Vendor ID'} placeholder={'Vendor ID'} name={'vendorID'} type={'text'} value={productData.vendorID} onChange={(e) => setProductData({ ...productData, vendorID: e.target.value })} disabled={true} />
                    </Box>
                </Box>
            </Box>
        </Grid>
    );
}

ProductView.propTypes = {
    open: PropTypes.bool,
    callback: PropTypes.func,
    modalStatus: PropTypes.object,
    user: PropTypes.object,
}

const styles = {
    root: {
        position: 'absolute',
        top: '0px',
        right: '0px',
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        backgroundColor: theme.palette.light.main,
        zIndex: '100',
        boxShadow: '-5px 0px 5px rgba(0, 0, 0, 0.1)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px',
        borderBottom: '1px solid #E0E0E0',
    },
    closeIcon: {
        fontSize: '24px',
        color: theme.palette.subtitle.main,
    },
    bodyContainer: {
        position: 'relative',
        padding: '24px',
    },
    overlay: {
        position: 'absolute',
        top: '0px',
        left: '0px',
        width: '100%',
        height: 'calc(100% - 48px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        zIndex: '1',
    },
    headerText: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: theme.palette.primary.main,
        cursor: 'pointer',
        '&:hover': {
            color: theme.palette.lightgray.main,
        }
    },
    subHeader: {
        display: 'flex',
        alignItems: 'center',
        paddingBottom: '24px',
        borderBottom: '1px solid #E0E0E0',
    },
    roleText: {
        fontSize: '14px',
        marginLeft: '12px',
        backgroundColor: theme.palette.primary.main,
        padding: '4px 8px',
        color: theme.palette.light.main,
        borderRadius: '4px',
        textAlign: 'center',
    },
    quantityButton: {
        padding: '4px',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.light.main,
        '&:hover': {
            backgroundColor: theme.palette.primary.light,
        },
        '&:disabled': {
            backgroundColor: theme.palette.lightgray.main,
            color: '301A1A',
        },
    },
    cartItemQuantityText: {
        fontSize: '12px',
        fontWeight: 'bold',
        color: theme.palette.primary.main,
        margin: '0px 12px',
    },
    cartItemTotal: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: theme.palette.primary.main,
        marginLeft: '24px',
    },
    addToCartContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: '24px',
        paddingBottom: '24px',
        borderBottom: '1px solid #E0E0E0',
    },
    addToCart: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '150px',
        height: '40px',
        backgroundColor: theme.palette.primary.main,
        borderRadius: '4px',
        cursor: 'pointer',
        '&:hover': {
            opacity: '.8',
        }
    },
    cartItemQuantity: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '24px',
        height: '100%',
        borderRight: '1px solid #E0E0E0',
    },
    addToCartText: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: theme.palette.light.main,
    },
    dataContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '24px',
        paddingBottom: '24px',
        borderBottom: '1px solid #E0E0E0',
    },
    metadataItem: {
        alignItems: 'center',
        justifyContent: 'left',
        marginBottom: '12px',
    },
    metaDataSelect: {
        width: '100%',
        height: '40px',
        padding: '10px',
        borderRadius: '4px',
        backgroundColor: theme.palette.light.main,
        border: 'none',
        '&:focus': {
            outline: 'none',
        },
    },
}

export default ProductView;