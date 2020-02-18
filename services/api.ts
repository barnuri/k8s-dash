import Axios, { AxiosRequestConfig } from 'axios';
import moment from 'moment';
import { yellow, blackBg } from '../helpers/colors';

let envBaseUrl = process.env.API_URL;
export const baseUrl = () => {
    envBaseUrl = envBaseUrl || process.env.API_URL;
    return envBaseUrl || 'http://localhost:8001';
};

const axiosSettings: () => AxiosRequestConfig = () => ({
    // timeout: 10000
    baseURL: baseUrl(),
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
});

const age = date => {
    const secs = moment().diff(moment(date), 'seconds');
    if (secs < 60) {
        return `${secs} secs`;
    }

    const mins = moment().diff(moment(date), 'minutes');
    if (mins < 60) {
        return `${mins} mins`;
    }

    const hours = moment().diff(moment(date), 'hours');
    if (hours < 24) {
        return `${hours} hours`;
    }

    const days = moment().diff(moment(date), 'days');
    if (days < 7) {
        return `${days} days`;
    }

    return `${moment().diff(moment(date), 'weeks')} weeks`;
};

const catchErr = (err, fallback: any = []) => {
    console.log(err);
    return fallback;
};

export const getPods = () =>
    Axios.get('/api/v1/pods', axiosSettings())
        .then(res => res.data)
        .then(res => res.items as any[])
        .catch(err => catchErr(err) as any[])
        .then(pods =>
            pods.map(pod => ({
                logLink: `/pod/${pod.metadata.namespace}/${pod.metadata.name}`,
                name: pod.metadata.name as string,
                namespace: pod.metadata.namespace as string,
                node: pod.spec.nodeName as string,
                age: age(pod.metadata.creationTimestamp),
            })),
        );

export const getPodLog = (podName, namespace = 'default') =>
    Axios.get(`/api/v1/namespaces/${namespace}/pods/${podName}/log`, axiosSettings())
        .then(res => res.data as string)
        .catch(err => catchErr(err, '') as string)
        .then(res => res.split('\n'));

export const getDeployments = async () =>
    Axios.get('/apis/apps/v1/deployments', axiosSettings())
        .then(res => res.data)
        .then(res => res.items as any[])
        .catch(err => catchErr(err) as any[])
        .then(res =>
            res.map(deploy => ({
                name: deploy.metadata.name as string,
                namespace: deploy.metadata.namespace as string,
                ready: `${deploy.status.readyReplicas || 0}/${deploy.status.replicas}`,
                allReplicasUp: deploy.status.readyReplicas === deploy.status.replicas,
                age: age(deploy.metadata.creationTimestamp),
                logLink: `/deployment/${deploy.metadata.namespace}/${deploy.metadata.name}`,
            })),
        );

export const getDeploymentLogs = async (deployName: string, namespace: string = 'default') => {
    const pods = await getPods();
    const matches = pods.filter(x => x.namespace === namespace && x.name.includes(deployName));
    const promises: any[] = [];
    const logs: string[] = [];

    for (let index = 0; index < matches.length; index++) {
        const pod = matches[index];
        promises.push(getPodLog(pod.name, pod.namespace).then(log => logs.push(blackBg(yellow(`pod index - ${index}`)), ...log)));
    }

    await Promise.all(promises);
    return logs;
};

export const getServices = () =>
    Axios.get('/api/v1/services', axiosSettings())
        .then(res => res.data)
        .then(res => res.items as any[])
        .catch(err => catchErr(err) as any[])
        .then(services =>
            services.map(svc => ({
                name: svc.metadata.name as string,
                namespace: svc.metadata.namespace as string,
                clusterIP: svc.spec.clusterIP as string,
                type: svc.spec.type as string,
                ports: svc.spec.ports.map(port => `${port.port}/${port.protocol}`).join(', ') as string,
                age: age(svc.metadata.creationTimestamp),
            })),
        );

export const getNodes = () =>
    Axios.get('/api/v1/nodes', axiosSettings())
        .then(res => res.data)
        .then(res => res.items as any[])
        .catch(err => catchErr(err) as any[])
        .then(nodes =>
            nodes.map(node => ({
                name: node.metadata.name as string,
                age: age(node.metadata.creationTimestamp),
                status: node.status.conditions.filter(x => x.status === 'True')[0].type as string,
                roles: Object.keys(node.metadata.labels)
                    .filter(x => x.includes('node-role.kubernetes.io/'))
                    .map(x => x.split('/')[1])
                    .join(', ') as string,
                version: node.status.nodeInfo.kubeletVersion as string,
            })),
        );

export const getIngresses = () =>
    Axios.get('/apis/extensions/v1beta1/ingresses', axiosSettings())
        .then(res => res.data)
        .then(res => res.items as any[])
        .catch(err => catchErr(err) as any[])
        .then(ingresses =>
            ingresses.map(ingress => ({
                name: ingress.metadata.name as string,
                namespace: ingress.metadata.namespace as string,
                age: age(ingress.metadata.creationTimestamp),
                address: '',
                ports: '80',
                hosts: ingress.spec.rules.map(rule => rule.host).join(', ') as string,
            })),
        );
