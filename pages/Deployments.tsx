import * as React from 'react';
import Layout from '../components/Layout';
import { getDeployments, baseUrl } from '../services/api';
import { withRedux } from '../helpers/withRedux';
import TableStyle from '../components/TableStyle';

import { shallowEqual, useSelector } from 'react-redux';

const Deployments = props => {
    const namespace = useSelector(state => state.namespace, shallowEqual);

    return (
        <Layout title='Deployments Lists' baseUrl={props.baseUrl}>
            <table>
                <thead>
                    <tr>
                        <th>Namespace</th>
                        <th>Name</th>
                        <th>Ready</th>
                        <th>Age</th>
                        <th>Log</th>
                    </tr>
                </thead>
                <tbody>
                    {props.data
                        .filter(svc => !namespace || svc.namespace === namespace)
                        .map((deploy, index) => (
                            <tr key={index}>
                                <td>{deploy.namespace}</td>
                                <td>{deploy.name}</td>
                                <td style={{ color: 'white', backgroundColor: deploy.allReplicasUp ? 'green' : 'red' }}>{deploy.ready}</td>
                                <td>{deploy.age}</td>
                                <td>
                                    <span
                                        style={{ cursor: 'pointer', textDecoration: 'underline', color: 'black' }}
                                        onClick={() => location.replace(deploy.logLink)}
                                    >
                                        Logs
                                    </span>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <TableStyle />
        </Layout>
    );
};
Deployments.getInitialProps = async () => ({ data: await getDeployments(), baseUrl: baseUrl() });
export default withRedux(Deployments);
