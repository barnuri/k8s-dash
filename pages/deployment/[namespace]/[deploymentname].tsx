import React from 'react';
import { getDeploymentLogs, baseURL } from '../../../services/api';
import Ansi from 'ansi-to-react';
import Layout from '../../../components/Layout';
import { withRouter } from 'next/router';
import { withRedux } from '../../../lib/withRedux';

const PodLogs = props => {
    return (
        <Layout title='Pod Logs' baseUrl={props.baseUrl}>
            <h1>Deployment: {props.router.query.deploymentname}</h1>
            <h2>Namespace: {props.router.query.namespace}</h2>
            <h3>Log</h3>
            {props.log.map((logLine, index) => (
                <div key={index}>
                    <Ansi>{logLine}</Ansi>
                </div>
            ))}
        </Layout>
    );
};

PodLogs.getInitialProps = async ({ query }) => ({ log: await getDeploymentLogs(query.deploymentname, query.namespace), baseUrl: baseURL() });

export default withRedux(withRouter(PodLogs));
