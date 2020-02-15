import * as React from 'react';
import Layout from '../components/Layout';
import TableStyle from '../components/TableStyle';
import { getPods, baseURL } from '../services/api';
import { withRedux } from '../lib/withRedux';
import { shallowEqual, useSelector } from 'react-redux';

const PodLists = props => {
    const namespace = useSelector(state => state.namespace, shallowEqual);

    return (
        <Layout title='Pod Lists' baseUrl={props.baseUrl}>
            <table>
                <thead>
                    <tr>
                        <th>Namespace</th>
                        <th>Name</th>
                        <th>Node</th>
                        <th>Log</th>
                    </tr>
                </thead>
                <tbody>
                    {props.data
                        .filter(svc => !namespace || svc.namespace === namespace)
                        .map(pod => (
                            <tr key={pod.name}>
                                <td>{pod.namespace}</td>
                                <td>{pod.name}</td>
                                <td>{pod.node}</td>
                                <td>
                                    <span
                                        style={{ cursor: 'pointer', textDecoration: 'underline', color: 'black' }}
                                        onClick={() => location.replace(pod.logLink)}
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
PodLists.getInitialProps = async () => ({ data: await getPods(), baseUrl: baseURL() });
export default withRedux(PodLists);
