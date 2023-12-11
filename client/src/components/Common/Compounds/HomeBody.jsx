import { Box, Grid, TextField, Typography } from "@mui/material";
import Cart from '@mui/icons-material/ShoppingCart';
import { theme } from "../../../theme/muiTheme";
import Fire from '@mui/icons-material/Whatshot';
import Arrow from '@mui/icons-material/ArrowForwardIos';
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import ProductCard from "../Molecules/ProductCard";
import UserCard from "../Molecules/UserCard";
import { useDispatch, useSelector } from "react-redux";
import MoonLoader from "react-spinners/MoonLoader";
import { getUsers } from "../../../../context/slices/userSlice";
import { getProducts } from "../../../../context/slices/productSlice";
import { getCart, setCartLength } from "../../../../context/slices/cartSlice";
import CartView from "./CartView";
import toast from "react-hot-toast";

const useFetchUsers = () => {
    const dispatch = useDispatch();
    // eslint-disable-next-line no-unused-vars
    const [usersLoading, setUsersLoading] = useState(true);
    const [users, setUsers] = useState([]);
      useEffect(() => {
          const query = new URLSearchParams(window.location.search);
          console.log("Query parameters:", query.toString());
    
          if (query.get("success")) {
              toast.success("Order placed! You will receive an email confirmation.");
          } 
          if (query.get("cancel")) {
            toast.error(
              "Order canceled -- continue to shop around and checkout when you're ready."
            );
          }
      }, []);

    useEffect(() => {
        dispatch(getUsers())
            .then((res) => {
                setUsers(res.payload.users);
            })
    }
        , [dispatch]);

    return { users, usersLoading };
}

const useFetchProducts = () => {
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [productsLoading, setProductsLoading] = useState(true);

    useEffect(() => {
        dispatch(getProducts())
            .then((res) => {
                setProducts(res.payload.products);
            })
    }
        , [dispatch]);

    return { products, productsLoading };
}

const useFetchCart = () => {
    const dispatch = useDispatch();
    const [userCart, setUserCart] = useState([]);
    const [cartLoading, setCartLoading] = useState(true);

    useEffect(() => {
        dispatch(getCart())
            .then((res) => {
                setUserCart(res.payload.items);
                setCartLoading(false);
                dispatch(setCartLength(res.payload.items.length));
            });
    }, [dispatch]);

    return { userCart, cartLoading };
};


const HomeBody = () => {
    const [searchText, setSearchText] = useState('');
    const [products, setProducts] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const { users } = useFetchUsers();
    const { products: productsFromStore } = useFetchProducts();
    const { userCart, cartLoading } = useFetchCart();
    const cartLength = useSelector((state) => state.cart.length);


    const [productsLoading, setProductsLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(true);

    const [showUserCart, setShowUserCart] = useState(false);

    useEffect(() => {
        setProducts(productsFromStore);
        setDoctors(users.filter((user) => user.role === 'doctor'));
        setProductsLoading(false);
        setUsersLoading(false);
    }, [productsFromStore, users, userCart]);

    const handleSearch = (e) => {
        setSearchText(e.target.value);
        if (e.target.value.length > 0) {
            const filteredProducts = products.filter((product) => {
                return product.name.toLowerCase().includes(e.target.value.toLowerCase())
                    || product.description.toLowerCase().includes(e.target.value.toLowerCase());
            });

            const filteredDoctors = doctors.filter((doctor) => {
                const fullName = `${doctor.firstName} ${doctor.lastName}`;
                return fullName.toLowerCase().includes(e.target.value.toLowerCase())
                    || doctor.bio.toLowerCase().includes(e.target.value.toLowerCase());
            });

            setProducts(filteredProducts);
            setDoctors(filteredDoctors);
        } else {
            setProducts(productsFromStore);
            setDoctors(users.filter((user) => user.role === 'doctor'));
        }
    }

    return (
        <Grid item xs={10} sx={styles.bodyContainer}>
            <Box sx={styles.topBar}>
                <Typography sx={styles.date}>
                    {new Date().toDateString('en-US')}
                </Typography>
                <Box sx={styles.searchBarContainer}>
                    <TextField
                        placeholder={'Search for products & doctors'}
                        name={name}
                        fullWidth
                        variant="standard"
                        type={'text'}
                        size='small'
                        sx={styles.input}
                        inputProps={{
                            sx: {
                                padding: '10px',
                                borderRadius: '20px',
                                outline: 'none',
                            }
                        }}
                        value={searchText}
                        onChange={handleSearch}
                    />
                </Box>
                {cartLoading && <MoonLoader color={theme.palette.primary.main} size={14} />}
                {!cartLoading &&
                    <Box sx={styles.cartIconContainer} onClick={() => setShowUserCart(!showUserCart)}>
                        <Typography sx={styles.cartLength}>{cartLength}</Typography>
                        <Cart sx={styles.cartIcon} />
                    </Box>
                }
                {showUserCart && <CartView open={showUserCart} callback={() => setShowUserCart(!showUserCart)} />}
            </Box>
            {!showUserCart && (
            <>
            <Box sx={styles.bodyContentContainer}>
                <Box sx={styles.bodyContent}>
                    <Typography sx={styles.bodyContentTitle} variant="h6">
                        Find your favorite products & doctors here
                    </Typography>
                    {usersLoading ?
                        <MoonLoader color={theme.palette.primary.main} size={14} />
                        :
                        <ReusableContent title={'Doctors'} data={doctors} CardComponent={UserCard} />
                    }
                    {productsLoading ?
                        <MoonLoader color={theme.palette.primary.main} size={14} />
                        :
                        <ReusableContent title={'Products'} data={products} CardComponent={ProductCard} />
                    }
                </Box>
            </Box>
            </>
            )}
        </Grid>
    )
};

const ReusableContent = ({ title, data, CardComponent }) => {
    const [showLimitedData, setShowLimitedData] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [filteredData, setFilteredData] = useState(data);

    const [categories, setCategories] = useState(title === 'Products' ?
        [...new Set(data.map((item) => item.category)), 'Age Restricted'] : []);

    useEffect(() => {
        setCategories([...new Set(data.map((item) => item.category)), 'Age Restricted']);
        if (selectedCategory === 'All') {
            setFilteredData(data);
        } else {
            if (selectedCategory === 'Age Restricted') {
            
                setFilteredData(data.filter((item) => item.ageRestricted));
            } else {
                setFilteredData(data.filter((item) => item.category === selectedCategory));
            }
        }
    }, [selectedCategory, data]);

    return (
        <>
            <Box sx={styles.titleContainer}>
                {/* <Fire sx={{ fontSize: '24px', color: theme.palette.primary.main, marginRight: '10px' }} /> */}
                <Typography sx={styles.title}>
                    {title}
                </Typography>
            </Box>
            {
                title === 'Products' &&
                <Box sx={styles.categoriesContainer}>
                    <Box sx={styles.categories}>
                        <Typography sx={selectedCategory === 'All' ? { ...styles.category, ...styles.selectedCategory } : styles.category} onClick={() => setSelectedCategory('All')}>
                            All
                        </Typography>
                        {categories.map((category, index) => (
                            <Typography sx={selectedCategory === category ? { ...styles.category, ...styles.selectedCategory } : styles.category} key={index} onClick={() => setSelectedCategory(category)}>
                                {category}
                            </Typography>
                        ))}
                    </Box>
                </Box>
            }

            <Box sx={styles.bodyContentCardsContainer}>
                {
                    filteredData.length > 0 && filteredData.map((item) => (
                        <CardComponent item={item} key={item._id} />
                    ))
                }
                {data.length === 0 && (
                    <Box sx={styles.taglineContainer}>
                        <Typography sx={styles.tagline}>
                            {`No ${title.toLowerCase()} found`}
                        </Typography>
                    </Box>
                )}
            </Box>

            <Box sx={styles.viewAllContainer} onClick={() => setShowLimitedData(!showLimitedData)}>
                <Typography sx={styles.viewAllText}>
                    {showLimitedData ? `View all ${title}` : `View less ${title}`}
                </Typography>
                <Arrow sx={{ fontSize: '14px', color: theme.palette.primary.main, marginLeft: '5px' }} />
            </Box>
        </>
    );
};

ReusableContent.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    CardComponent: PropTypes.elementType.isRequired,
}


const styles = {
    bodyContainer: {
        marginLeft: '16.66%',
        height: '100vh',
        maxHeight: '100vh',
    },
    topBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: '20px',
        marginRight: '20px',
        height: '70px',
        borderBottom: '1px solid #E0E0E0',
    },
    date: {
        fontWeight: 'bold',
    },
    searchBarContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        height: '40px',
        borderTopRightRadius: '4px',
        borderTopLeftRadius: '4px',
        backgroundColor: '#F5F5F5',
    },
    input: {
        borderRadius: '20px',
        outline: 'none',
    },
    cartIconContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        position: 'relative',
        '&:hover': {
            cursor: 'pointer',
        },
    },
    cartLength: {
        position: 'absolute',
        top: '0px',
        right: '0px',
        fontWeight: 'bold',
        fontSize: '9px',
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.secondary.main,
        padding: '2px 5px',
        borderRadius: '50%',
        zIndex: '1',
    },
    cartIcon: {
        position: 'absolute',
        fontSize: '24px',
        color: theme.palette.primary.main,
    },
    bodyContentContainer: {
        padding: '20px',
        display: 'flex',
    },
    bodyContent: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    bodyContentTitle: {
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    bodyContentCardsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        '& > *': {
            flex: '1 1 30%',
        },
        gap: '20px',
        width: '100%',
        height: '100%',
    },
    titleContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
    },
    title: {
        fontWeight: 'bold',
        fontSize: '20px',
    },
    categoriesContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
    },
    categoriesTitle: {
        fontWeight: 'bold',
        fontSize: '16px',
        marginRight: '10px',
    },
    categories: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        gap: '10px',
    },
    category: {
        fontWeight: 'bold',
        fontSize: '14px',
        backgroundColor: '#F5F5F5',
        color: '#757575',
        padding: '5px 10px',
        borderRadius: '4px',
        '&:hover': {
            cursor: 'pointer',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
        },
        transition: 'all 0.2s ease-in-out',
    },
    selectedCategory: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
    bodyContentCard: {
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
        padding: '5px 10px',
        borderRadius: '4px',
    },
    productCardFooterUnits: {
        fontSize: '14px',
        backgroundColor: '#E0E0E0',
        color: '#757575',
        padding: '5px 10px',
        borderRadius: '4px',
    },
}

export default HomeBody;