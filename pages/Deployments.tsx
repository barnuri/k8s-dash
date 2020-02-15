import * as React from 'react';
import Layout from '../components/Layout';
import TableStyle from '../components/TableStyle';
import { getDeployments, baseURL } from '../services/api';

const Deployments = props => {
    return (
        <Layout title='Deployments Lists' baseUrl={props.baseUrl}>
            <table>
                <thead>
                    <tr>
                        <th>Namespace</th>
                        <th>Name</th>
                        <th>Ready</th>
                        <th>Age</th>
                    </tr>
                </thead>
                <tbody>
                    {props.data.map((deploy, index) => (
                        <tr key={index}>
                            <td>{deploy.namespace}</td>
                            <td>{deploy.name}</td>
                            <td style={{ color: 'white', backgroundColor: deploy.allReplicasUp ? 'green' : 'red' }}>{deploy.ready}</td>
                            <td>{deploy.age}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <TableStyle />
        </Layout>
    );
};
Deployments.getInitialProps = async () => ({ data: await getDeployments(), baseUrl: baseURL() });
export default Deployments;
