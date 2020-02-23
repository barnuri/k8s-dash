import * as React from 'react';
import Layout from '../components/Layout';
import { getDeployments, baseUrl } from '../services/api';
import { withRedux } from '../helpers/withRedux';

import { shallowEqual, useSelector } from 'react-redux';
import Table from '../components/Table';

const Deployments = props => {
    const namespace = useSelector(state => state.namespace, shallowEqual);
    return (
        <Layout title='Deployments Lists' baseUrl={props.baseUrl}>
            <Table
                data={props.data.filter(item => !namespace || item.namespace === namespace)}
                cols={[
                    { title: 'Cluster', value: item => item.cluster },
                    { title: 'Namespace', value: item => item.namespace },
                    { title: 'name', value: item => item.name },
                    {
                        title: 'Ready',
                        value: item => item.ready,
                        style: item => ({ color: 'white', backgroundColor: item.allReplicasUp ? 'green' : 'red' }),
                    },
                    { title: 'Age', value: item => item.age },
                    {
                        title: 'Logs',
                        value: () => '',
                        customComponent: item => (
                            <a href={item.logLink} target='_blank' style={{ color: 'black' }}>
                                Logs
                            </a>
                        ),
                    },
                ]}
            />
        </Layout>
    );
};
Deployments.getInitialProps = async () => ({ data: await getDeployments(), baseUrl: baseUrl() });
export default withRedux(Deployments);
