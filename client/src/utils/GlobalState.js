import {Provider} from 'react-redux';
import store from './store';
import React from 'react';

export const StoreProvider = ({...props}) => {
    return (
    <Provider store={store} {...props}>

    </Provider>
    )
};
