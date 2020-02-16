import * as React from 'react';
import Layout from '../components/Layout';
import { getServices, baseUrl } from '../services/api';
import { withRedux } from '../helpers/withRedux';
import { shallowEqual, useSelector } from 'react-redux';
import TableStyle from '../components/TableStyle';

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
Services.getInitialProps = async () => ({ data: await getServices(), baseUrl: baseUrl() });
export default withRedux(Services);
