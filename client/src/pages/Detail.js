import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import spinner from '../assets/spinner.gif';

import { QUERY_PRODUCTS } from '../utils/queries';
import {
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  ADD_TO_CART,
  UPDATE_PRODUCTS,
} from '../utils/actions';
import { useStoreContext } from "../utils/GlobalState";

import { useSelector, useDispatch } from 'react-redux';
import {
  removeFromCart,
  updateCartQuantity,
  addToCart,
  updateProducts,
  selectGlobal
} from '../utils/globalSlice'

import { idbPromise } from "../utils/helpers";

import Cart from '../components/Cart';

function Detail() {
  const state = useSelector(selectGlobal);
  const dispatch = useDispatch();

  // const [state, dispatch] = useStoreContext();
  const { id } = useParams();

  const [currentProduct, setCurrentProduct] = useState({})

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  const { products, cart } = state;

  useEffect(() => {
    // already in global store
    if (products.length) {
      setCurrentProduct(products.find(product => product._id === id));
    }
    // retrieved from server
    else if (data) {

      dispatch(updateProducts(data))
      // dispatch({
      //   type: UPDATE_PRODUCTS,
      //   products: data.products
      // });

      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    }
    // get cache from idb
    else if (!loading) {
      idbPromise('products', 'get').then((indexedProducts) => {
        dispatch(updateProducts(indexedProducts))
        // dispatch({
        //   type: UPDATE_PRODUCTS,
        //   products: indexedProducts
        // });
      });
    }
  }, [products, data, loading, dispatch, id]);

  const addItemToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id)

    if (itemInCart) {
      dispatch(updateCartQuantity({
        _id: currentProduct._id, 
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      }))
      // dispatch({
      //   type: UPDATE_CART_QUANTITY,
      //   _id: id,
      //   purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      // });
      // if we're updating quantity, use existing item data and increment purchaseQuantity value by one
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
    } else {
      dispatch(addToCart({...currentProduct, purchaseQuantity: 1}))
      // dispatch({
      //   type: ADD_TO_CART,
      //   product: { ...currentProduct, purchaseQuantity: 1 }
      // });
      // if product isn't in the cart yet, add it to the current shopping cart in IndexedDB
      idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 });
    }
  }

  const removeItemFromCart = () => {
    dispatch(removeFromCart(currentProduct))
    // dispatch({
    //   type: REMOVE_FROM_CART,
    //   _id: currentProduct._id
    // });

    // upon removal from cart, delete the item from IndexedDB using the `currentProduct._id` to locate what to remove
    idbPromise('cart', 'delete', { ...currentProduct });
  };

  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button onClick={addItemToCart}>Add to Cart</button>
            <button
              disabled={!cart.find(p => p._id === currentProduct._id)}
              onClick={removeItemFromCart}
            >
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

export default Detail;
