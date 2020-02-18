import * as React from 'react';
import Layout from '../components/Layout';
import { getIngresses, baseUrl } from '../services/api';
import { withRedux } from '../helpers/withRedux';

import { shallowEqual, useSelector } from 'react-redux';
import Table from '../components/Table';

const Ingresses = props => {
    const namespace = useSelector(state => state.namespace, shallowEqual);
    const fixHost = (host: string) =>
        host
            .trim()
            .trimLeft()
            .trimRight()
            .trim();
    return (
        <Layout title='Ingresses Lists' baseUrl={props.baseUrl}>
            <Table
                data={props.data.filter(item => !namespace || item.namespace === namespace)}
                cols={[
                    { title: 'Namespace', value: item => item.namespace },
                    { title: 'Name', value: item => item.name },
                    {
                        title: 'Hosts',
                        value: item => item.hosts,
                        customComponent: item => (
                            <>
                                {item.hosts.split(',').map((host, hostIndex) => (
                                    <React.Fragment key={`host-${hostIndex}`}>
                                        <a style={{ color: 'black' }} target='_blank' href={`http://${fixHost(host)}`}>
                                            {fixHost(host)}
                                        </a>
                                        <br />
                                    </React.Fragment>
                                ))}
                            </>
                        ),
                    },
                    { title: 'Address', value: item => item.address },
                    { title: 'Ports', value: item => item.ports },
                    { title: 'Age', value: item => item.age },
                ]}
            />
        </Layout>
    );
};
Ingresses.getInitialProps = async () => ({ data: await getIngresses(), baseUrl: baseUrl() });
export default withRedux(Ingresses);
