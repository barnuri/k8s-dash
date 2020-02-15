import * as React from 'react';
import Layout from '../components/Layout';
import TableStyle from '../components/TableStyle';
import { getNodes, baseURL } from '../services/api';
import { withRedux } from '../lib/withRedux';

const Nodes = props => {
    return (
        <Layout title='Nodes Lists' baseUrl={props.baseUrl}>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Roles</th>
                        <th>Age</th>
                        <th>Version</th>
                    </tr>
                </thead>
                <tbody>
                    {props.data.map((node, index) => (
                        <tr key={index}>
                            <td>{node.name}</td>
                            <td style={{ color: 'white', backgroundColor: node.status === 'Ready' ? 'green' : 'red' }}>{node.status}</td>
                            <td>{node.roles}</td>
                            <td>{node.age}</td>
                            <td>{node.version}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <TableStyle />
        </Layout>
    );
};
Nodes.getInitialProps = async () => ({ data: await getNodes(), baseUrl: baseURL() });
export default withRedux(Nodes);
