import * as React from 'react';
import Head from 'next/head';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';

const Layout = props => {
    const namespace = useSelector(state => state.namespace, shallowEqual);
    const dispatch = useDispatch();
    const link = name => {
        const path = `/${name === 'Pods' ? '' : name}`;
        const navigate = () => location.replace(path);
        return (
            <span style={{ cursor: 'pointer', textDecoration: 'underline', color: 'black', padding: 10 }} onClick={navigate}>
                {name}
            </span>
        );
    };
    return (
        <div>
            <Head>
                <title>{props.title}</title>
                <meta charSet='utf-8' />
                <meta name='viewport' content='initial-scale=1.0, width=device-width' />
            </Head>
            <header>
                <nav>
                    {link('Pods')}
                    {link('Deployments')}
                    {link('Services')}
                    {link('Ingresses')}
                    {link('Nodes')}
                </nav>
            </header>
            <hr />
            <span style={{ padding: 5 }}>namespace:</span>
            <input value={namespace} onChange={e => dispatch({ type: 'NAMESPACE', namespace: e.target.value })} />
            <span style={{ padding: 5 }}>(clear the field if you want to see all namespaces)</span>
            <hr />
            {props.children}
            <footer>
                <hr />
                <span>baseURL: {props.baseUrl}</span>
            </footer>
        </div>
    );
};

export default Layout;
