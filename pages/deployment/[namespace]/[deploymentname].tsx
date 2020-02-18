import React from 'react';
import { getDeploymentLogs, baseUrl } from '../../../services/api';
import Layout from '../../../components/Layout';
import { withRouter } from 'next/router';
import { withRedux } from '../../../helpers/withRedux';
import LogComponent from '../../../components/LogComponent';

const PodLogs = props => {
    return (
        <Layout title='Pod Logs' baseUrl={props.baseUrl}>
            <div style={{ marginLeft: 8 }}>
                <h1>Deployment: {props.router.query.deploymentname}</h1>
                <h2>Namespace: {props.router.query.namespace}</h2>
                <h3>Log</h3>
            </div>
            <LogComponent log={props.log} />
        </Layout>
    );
};

PodLogs.getInitialProps = async ({ query }) => ({ log: await getDeploymentLogs(query.deploymentname, query.namespace), baseUrl: baseUrl() });

export default withRedux(withRouter(PodLogs));
