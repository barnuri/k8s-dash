import React from 'react';
import { getPodLog } from '../../../services/api';
import Ansi from 'ansi-to-react';
import Layout from '../../../components/Layout';
import { withRouter } from 'next/router';

const PodLogs = props => {
    return (
        <Layout title='Pod Logs'>
            <h1>Pod: {props.router.query.podname}</h1>
            <h2>Namespace: {props.router.query.namespace}</h2>
            <h3>Log</h3>
            {props.log.map((logLine, index) => (
                <div key={index}>
                    <Ansi>{logLine}</Ansi>
                </div>
            ))}
            {/* <h4 dangerouslySetInnerHTML={{ __html: props.log.split('\n').join('<br/>') }}></h4> */}
        </Layout>
    );
};

PodLogs.getInitialProps = async ({ query }) => ({ log: await getPodLog(query.podname, query.namespace) });

export default withRouter(PodLogs);
