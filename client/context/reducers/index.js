import { combineReducers } from 'redux';
import authReducer from '../slices/authSlice';
import categoryReducer from '../slices/categoriesSlice';
import userReducer from '../slices/userSlice';
import cartReducer from '../slices/cartSlice';
import productReducer from '../slices/productSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  categories: categoryReducer,
  users: userReducer,
  cart: cartReducer,
  products: productReducer,
});

export default rootReducer;
