import * as React from 'react';
import Layout from '../components/Layout';
import { getNodes, baseUrl } from '../services/api';
import { withRedux } from '../helpers/withRedux';
import Table from '../components/Table';

const Nodes = props => {
    return (
        <Layout title='Nodes Lists' baseUrl={props.baseUrl}>
            <Table
                data={props.data}
                cols={[
                    { title: 'Cluster', value: item => item.cluster },
                    { title: 'Name', value: item => item.name },
                    {
                        title: 'Status',
                        value: item => item.status,
                        style: item => ({ color: 'white', backgroundColor: item.status === 'Ready' ? 'green' : 'red' }),
                    },
                    { title: 'Roles', value: item => item.roles },
                    { title: 'Age', value: item => item.age },
                    { title: 'Version', value: item => item.version },
                ]}
            />
        </Layout>
    );
};
Nodes.getInitialProps = async () => ({ data: await getNodes(), baseUrl: baseUrl() });
export default withRedux(Nodes);
