import Cookie from "js-cookie";
import Axios from "axios";
import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_SHIPPING, CART_SAVE_PAYMENT } from "../constants/cartConstants";

const addItemToCart = (productId, quantity) => async (dispatch, getState) => {
  try {
    const { data } = await Axios.get("/api/products/" + productId);
    dispatch({
      type: CART_ADD_ITEM, payload: {
        product: data._id,
        name: data.name,
        image: data.image,
        price: data.price,
        countInStock: data.countInStock,
        quantity,
      },
    });
    const { cart: { cartItems } } = getState();
    Cookie.set("cartItems", JSON.stringify(cartItems));
  } catch (error) {
    // Handle error (e.g., log it or dispatch an error action)
  }
}

const removeItemFromCart = (productId) => (dispatch, getState) => {
  dispatch({ type: CART_REMOVE_ITEM, payload: productId });

  const { cart: { cartItems } } = getState();
  Cookie.set("cartItems", JSON.stringify(cartItems));
}

const saveShippingDetails = (shippingData) => (dispatch) => {
  dispatch({ type: CART_SAVE_SHIPPING, payload: shippingData });
}

const savePaymentDetails = (paymentData) => (dispatch) => {
  dispatch({ type: CART_SAVE_PAYMENT, payload: paymentData });
}

export { addItemToCart, removeItemFromCart, saveShippingDetails, savePaymentDetails };
