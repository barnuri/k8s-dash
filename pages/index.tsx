import * as React from 'react';
import Layout from '../components/Layout';
import { getPods, baseUrl } from '../services/api';
import { withRedux } from '../helpers/withRedux';

import { shallowEqual, useSelector } from 'react-redux';
import Table from '../components/Table';

const PodLists = props => {
    const namespace = useSelector(state => state.namespace, shallowEqual);

    return (
        <Layout title='Pod Lists' baseUrl={props.baseUrl}>
            <Table
                data={props.data.filter(item => !namespace || item.namespace === namespace)}
                cols={[
                    { title: 'Cluster', value: item => item.cluster },
                    { title: 'Namespace', value: item => item.namespace },
                    { title: 'Name', value: item => item.name },
                    { title: 'Node', value: item => item.name },
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
PodLists.getInitialProps = async () => ({ data: await getPods(), baseUrl: baseUrl() });
export default withRedux(PodLists);
