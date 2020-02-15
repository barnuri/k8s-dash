import * as React from 'react';
import Head from 'next/head';

const Layout = props => {
    const link = name => (
        <span
            style={{ cursor: 'pointer', textDecoration: 'underline', color: 'black', padding: 10 }}
            onClick={() => location.replace(`/${name === 'Pods' ? '' : name}`)}
        >
            {name}
        </span>
    );
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
            {props.children}
            <footer>
                <hr />
                <span>baseURL: {props.baseUrl}</span>
            </footer>
        </div>
    );
};

export default Layout;
