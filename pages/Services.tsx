import * as React from 'react';
import Layout from '../components/Layout';
import TableStyle from '../components/TableStyle';
import { getServices } from '../services/api';

const Services = props => {
    return (
        <Layout title='Services Lists'>
            <table>
                <thead>
                    <tr>
                        <th>Namespace</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Cluster-IP</th>
                        <th>Ports</th>
                        <th>Age</th>
                    </tr>
                </thead>
                <tbody>
                    {props.data.map((svc, index) => (
                        <tr key={index}>
                            <td>{svc.namespace}</td>
                            <td>{svc.name}</td>
                            <td>{svc.type}</td>
                            <td>{svc.clusterIP}</td>
                            <td>{svc.ports}</td>
                            <td>{svc.age}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <TableStyle />
        </Layout>
    );
};
Services.getInitialProps = async () => ({ data: await getServices() });
export default Services;
