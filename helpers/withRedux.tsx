import React from 'react';
import { Provider } from 'react-redux';
import { initializeStore } from '../store';
import { PersistGate } from 'redux-persist/integration/react';

export const withRedux = PageComponent => {
    const store = initializeStore();

    const WithRedux = ({ initialReduxState, ...props }) => {
        return (
            <Provider store={store}>
                <PersistGate persistor={store.__PERSISTOR} loading={null}>
                    <PageComponent {...props} />
                </PersistGate>
            </Provider>
        );
    };

    if (PageComponent.getInitialProps) {
        WithRedux.getInitialProps = async context => {
            context.reduxStore = store;
            const pageProps = typeof PageComponent.getInitialProps === 'function' ? await PageComponent.getInitialProps(context) : {};
            return {
                ...pageProps,
                initialReduxState: store.getState(),
            };
        };
    }

    return WithRedux;
};
