import * as React from 'react';
import Layout from '../components/Layout';
import { getServices, baseUrl } from '../services/api';
import { withRedux } from '../helpers/withRedux';
import { shallowEqual, useSelector } from 'react-redux';
import Table from '../components/Table';

const Services = props => {
    const namespace = useSelector(state => state.namespace, shallowEqual);

    return (
        <Layout title='Services Lists' baseUrl={props.baseUrl}>
            <Table
                data={props.data.filter(item => !namespace || item.namespace === namespace)}
                cols={[
                    { title: 'Cluster', value: item => item.cluster },
                    { title: 'Namespace', value: item => item.namespace },
                    { title: 'Name', value: item => item.name },
                    { title: 'Type', value: item => item.type },
                    { title: 'Cluster-IP', value: item => item.clusterIP },
                    { title: 'Ports', value: item => item.ports },
                    { title: 'Age', value: item => item.age },
                ]}
            />
        </Layout>
    );
};
Services.getInitialProps = async () => ({ data: await getServices(), baseUrl: baseUrl() });
export default withRedux(Services);
