import { configureStore } from '@reduxjs/toolkit';
import reducer from './globalSlice';

export default configureStore({
    reducer: {
        global: reducer
    }
});
