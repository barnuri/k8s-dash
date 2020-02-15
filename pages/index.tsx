import * as React from 'react';
import Layout from '../components/Layout';
import TableStyle from '../components/TableStyle';
import { getPods } from '../services/api';

const PodLists = props => {
    return (
        <Layout title='Pod Lists'>
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
                    {props.data.map(pod => (
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
PodLists.getInitialProps = async () => ({ data: await getPods() });
export default PodLists;
