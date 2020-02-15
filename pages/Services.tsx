import * as React from 'react';
import Layout from '../components/Layout';
import TableStyle from '../components/TableStyle';
import { getServices, baseURL } from '../services/api';
import { withRedux } from '../lib/withRedux';
import { shallowEqual, useSelector } from 'react-redux';

const Services = props => {
    const namespace = useSelector(state => state.namespace, shallowEqual);

    return (
        <Layout title='Services Lists' baseUrl={props.baseUrl}>
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
                    {props.data
                        .filter(svc => !namespace || svc.namespace === namespace)
                        .map((svc, index) => (
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
Services.getInitialProps = async () => ({ data: await getServices(), baseUrl: baseURL() });
export default withRedux(Services);
