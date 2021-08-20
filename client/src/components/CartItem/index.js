import React from 'react';
import { useStoreContext } from '../../utils/GlobalState';
import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY } from '../../utils/actions';
import { idbPromise } from "../../utils/helpers";

import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateCartQuantity, selectGlobal } from '../../utils/globalSlice';

const CartItem = ({ item }) => {

    const state = useSelector(selectGlobal);
    const dispatch = useDispatch();
    // const [, dispatch] = useStoreContext();

    const removeItemFromCart = item => {
        dispatch(removeFromCart(item))
        // dispatch({
        //     type: REMOVE_FROM_CART,
        //     _id: item._id
        // });
        idbPromise('cart', 'delete', { ...item });
    };

    const onChange = (e) => {
        const value = e.target.value;
        console.log(value)

        if (value === '0') {

            dispatch(removeFromCart(item))
            // dispatch({
            //     type: REMOVE_FROM_CART,
            //     _id: item._id
            // });

            idbPromise('cart', 'delete', { ...item });
        } else {
            dispatch(updateCartQuantity({item, purchaseQuantity:parseInt(value)}))
            // dispatch({
            //     type: UPDATE_CART_QUANTITY,
            //     _id: item._id,
            //     purchaseQuantity: parseInt(value)
            // });

            idbPromise('cart', 'put', { ...item, purchaseQuantity: parseInt(value) });
        }
    };

    return (
        <div className="flex-row">
            <div>
                <img
                    src={`/images/${item.image}`}
                    alt=""
                />
            </div>
            <div>
                <div>{item.name}, ${item.price}</div>
                <div>
                    <span>Qty:</span>
                    <input
                        type="number"
                        placeholder="1"
                        value={item.purchaseQuantity}
                        onChange={onChange}
                    />
                    <span
                        role="img"
                        aria-label="trash"
                        onClick={() => removeItemFromCart(item)}
                    >
                        🗑️
                    </span>
                </div>
            </div>
        </div>
    );
}

export default CartItem;