import { Avatar, Box, Grid, IconButton, Typography } from '@mui/material';
import { theme } from '../../../theme/muiTheme';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductIcon from '@mui/icons-material/ShoppingCart';
import productIconImage from '../../../assets/images/productIcon.png';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import { checkoutCart, clearCartLocally, deleteItemFromCart, removeItemFromCartLocally, updateItemInCart, updateItemInCartLocally } from '../../../../context/slices/cartSlice';
import toast from 'react-hot-toast';
import MoonLoader from 'react-spinners/MoonLoader';
import { updateProduct, updateProductLocally } from '../../../../context/slices/productSlice';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51OEOecEmpCkUstvcE5dFuey53idyVJAS8l6Je44TLsLQS7ss5SNSBf1qqMmwyg1Fi7KRf28tOf4pvDtuCPxVPLfx00PgVzxC9n');

const CartView = ({ callback: handleModalOpenClose }) => {
  const [cart, setCart] = useState(useSelector(state => state.cart.cart?.items));
  const loggedInUser = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  const getTotalPrice = () => {
    let total = 0;
    cart.forEach(item => {
      total += item.product.price * item.quantity;
    });
    return total;
  }

  const handleCheckout = async (clientSecret) => {

    try {
      const stripe = await stripePromise;
  
      const { error } = await stripe.redirectToCheckout({
        sessionId: clientSecret,
      });
  
      // Clear cart locally
      dispatch(clearCartLocally());

      // Update product units based on the cart
      cart.forEach((item) => {
        const updatedProduct = {
          ...item.product,
          units: item.product.units - item.quantity,
        };

        dispatch(updateProduct(updatedProduct))
          .then(() => {
            dispatch(updateProductLocally(updatedProduct));
          })
          .catch((error) => {
            // console.error(`Failed to update product ${item.product._id} units:`, error);
          });
      });

      if (error) {
        console.error('Error redirecting to checkout:', error);
        toast.error('Checkout failed!');
      } else {
        // Redirect successful, user will be on the Stripe checkout page
        toast.success('Redirecting to checkout...');
      }

      toast.success('Checkout successful!');
      handleModalOpenClose();
    } catch (err) {
      console.log(err);
      toast.error('Checkout failed!');
    }
  };

  const checkout = () => {
    dispatch(checkoutCart(cart))
      .then((response) => {
        console.log('Checkout Response:', response);
        const { clientSecret } = response.payload;
        handleCheckout(clientSecret);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Checkout failed!');
      });
  };

  return (
    <Grid item xs={12} sx={styles.root}>
      {/* HEADER IS HERE */}
      <Box sx={styles.header}>
        <Box onClick={handleModalOpenClose}
          sx={{ cursor: 'pointer', '&:hover': { opacity: '.5' } }}>
          <CloseIcon sx={styles.closeIcon} />
        </Box>
        <Typography sx={styles.headerText} onClick={checkout}>
          {'Checkout'}
        </Typography>
      </Box>

      <Box sx={styles.bodyContainer}>
        <Box sx={styles.subHeader}>
          <ProductIcon sx={{ fontSize: '24px', color: theme.palette.primary.main }} />
          <Typography sx={{ fontSize: '24px', fontWeight: 'bold', marginLeft: '12px' }}>
            {loggedInUser ? loggedInUser.firstName + "' cart" : 'cart'}
          </Typography>
          <Typography sx={styles.roleText}>
            {loggedInUser ? loggedInUser.role : 'Guest'}
          </Typography>
        </Box>
        <Box sx={styles.dataContainer}>
          {cart && cart.length === 0 && <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>
            {'Explore our products and add them to your cart!'}
          </Typography>}
          {cart && cart.length > 0 && cart.map((item, index) => {
            return (
              <CartItemView key={index} item={item} setCart={setCart} cart={cart} />
            )
          })}
          {cart && cart.length > 0 && <Box sx={styles.footer}>
            <Typography sx={styles.footerText}>
              {'Subtotal: $ ' + getTotalPrice()}
            </Typography>
          </Box>}
        </Box>
      </Box>
    </Grid>
  );
};

CartView.propTypes = {
  open: PropTypes.bool,
  callback: PropTypes.func,
  modalStatus: PropTypes.object,
  user: PropTypes.object,
}

const CartItemView = ({ item, cart, setCart }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleQuantity = (type) => {
    setLoading(true);

    let newQuantity = type === 'increment' ? quantity + 1 : quantity - 1;
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > item.product.units) newQuantity = item.product.units;

    setQuantity(newQuantity);

    dispatch(updateItemInCart({ ...item, quantity: newQuantity }))
      .then(() => {
        const newCart = cart.map(cartItem => cartItem.product._id === item.product._id ? { ...cartItem, quantity: newQuantity } : cartItem);
        setCart(newCart);
        dispatch(updateItemInCartLocally(newCart));
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }

  const handleRemoveItem = () => {
    setLoading(true);
    dispatch(deleteItemFromCart(item.product._id))
      .then(() => {
        const newCart = cart.filter(cartItem => cartItem.product._id !== item.product._id);
        setCart(newCart);
        dispatch(removeItemFromCartLocally(item.product._id));
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }

  return (
    <Box sx={styles.cartItemContainer}>
      {loading &&
        <Box sx={styles.overlay}>
          <MoonLoader color={theme.palette.primary.main} loading={loading} size={36} />
        </Box>}
      <Box sx={styles.cartItem}>
        <Box sx={styles.cartItemImageContainer}>
          <Avatar sx={styles.cartItemImage} src={productIconImage} width='36px' height='36px' />
        </Box>
        <Box sx={styles.cartItemDetails}>
          <Typography sx={styles.cartItemName}>
            {item.product.name}
          </Typography>
          <Typography sx={styles.cartItemDesc}>
            {item.product.description.length > 50 ? `${item.product.description.substring(0, 50)}...` : item.product.description}
          </Typography>
          <Typography sx={styles.cartItemPrice}>
            $ {item.product.price} x{item.quantity}
          </Typography>
        </Box>
        <Box sx={styles.cartItemQuantity}>
          <IconButton sx={styles.quantityButton} onClick={() => handleQuantity('decrement')} disabled={quantity === 1}>
            <Remove />
          </IconButton>
          <Typography sx={styles.cartItemQuantityText}>
            {quantity}
          </Typography>
          <IconButton sx={styles.quantityButton} onClick={() => handleQuantity('increment')} disabled={quantity === item.product.units}>
            <Add />
          </IconButton>
        </Box>
        <Box sx={styles.cartItemTotal}>
          <Typography sx={styles.cartItemTotalText}>
            Total: $ {Math.round(item.product.price * quantity * 100) / 100}
          </Typography>
        </Box>
        <Box sx={styles.cartItemRemove}>
          <IconButton sx={styles.removeButton} onClick={handleRemoveItem}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

CartItemView.propTypes = {
  item: PropTypes.object,
  cart: PropTypes.array,
  setCart: PropTypes.func,
}

const styles = {
    root: {
        position: 'absolute',
        top: '0px',
        right: '0px',
        width: '100%',
        height: '100%',
        backgroundColor: theme.palette.light.main,
        overflowY: 'auto',
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
        padding: '24px',
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
    dataContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '24px',
        paddingBottom: '24px',
        borderTop: '1px solid #E0E0E0',
    },
    cartItemContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottom: '1px solid #E0E0E0',
        padding: '12px 0px',
    },
    overlay: {
        position: 'absolute',
        top: '0px',
        left: '0px',
        width: '100%',
        height: '100%',
        backgroundColor: theme.palette.light.main,
        opacity: '.5',
        zIndex: '1000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartItem: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
    cartItemImageContainer: {
        width: '10%',
        display: 'flex',
        justifyContent: 'center',
    },
    cartItemImage: {
        width: '36px',
        height: '36px',
    },
    cartItemDetails: {
        width: '40%',
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '12px',
    },
    cartItemName: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: theme.palette.primary.main,
        marginBottom: '4px',
    },
    cartItemDesc: {
        fontSize: '12px',
        color: theme.palette.subtitle.main,
        marginBottom: '4px',
    },
    cartItemPrice: {
        fontSize: '12px',
        color: theme.palette.subtitle.main,
        fontWeight: 'bold',
        marginBottom: '4px',
    },
    cartItemQuantity: {
        width: '20%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '12px',
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
        width: '15%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '12px',
    },
    cartItemTotalText: {
        fontSize: '12px',
        fontWeight: 'bold',
        color: theme.palette.primary.main,
    },
    cartItemRemove: {
        width: '5%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '12px',
    },
    removeButton: {
        padding: '4px',
        backgroundColor: theme.palette.alert.main,
        color: theme.palette.light.main,
        '&:hover': {
            backgroundColor: theme.palette.subtitle.main,
        }
    },
    footer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: '12px',
    },
    footerText: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: theme.palette.primary.main,
    },
}

export default CartView;