import { createStore } from 'redux';
import { persistStore } from 'redux-persist';

const initialState = { namespace: 'default' };

const reducer = (state = undefined, action) => {
    let newState: any = state || initialState;
    switch (action.type) {
        case 'NAMESPACE': {
            newState = {
                ...newState,
                namespace: action.namespace,
            };
        }
    }
    return newState;
};

let store;
export const initializeStore = (preloadedState = initialState) => {
    const isClient = typeof window !== 'undefined';
    if (isClient) {
        const { persistReducer } = require('redux-persist');
        const storage = require('redux-persist/lib/storage').default;
        const persistConfig = {
            key: 'root',
            storage,
        };
        store = createStore(persistReducer(persistConfig, reducer), preloadedState);
        store.__PERSISTOR = persistStore(store);
    } else {
        store = createStore(reducer, preloadedState);
    }
    return store;
};
