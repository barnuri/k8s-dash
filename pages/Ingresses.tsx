import * as React from 'react';
import Layout from '../components/Layout';
import TableStyle from '../components/TableStyle';
import { getIngresses, baseURL } from '../services/api';
import { withRedux } from '../lib/withRedux';
import { shallowEqual, useSelector } from 'react-redux';

const Ingresses = props => {
    const namespace = useSelector(state => state.namespace, shallowEqual);

    return (
        <Layout title='Ingresses Lists' baseUrl={props.baseUrl}>
            <table>
                <thead>
                    <tr>
                        <th>Namespace</th>
                        <th>Name</th>
                        <th>Hosts</th>
                        <th>Address</th>
                        <th>Ports</th>
                        <th>Age</th>
                    </tr>
                </thead>
                <tbody>
                    {props.data
                        .filter(svc => !namespace || svc.namespace === namespace)
                        .map((ingress, index) => (
                            <tr key={index}>
                                <td>{ingress.namespace}</td>
                                <td>{ingress.name}</td>
                                <td>{ingress.hosts}</td>
                                <td>{ingress.address}</td>
                                <td>{ingress.ports}</td>
                                <td>{ingress.age}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <TableStyle />
        </Layout>
    );
};
Ingresses.getInitialProps = async () => ({ data: await getIngresses(), baseUrl: baseURL() });
export default withRedux(Ingresses);
