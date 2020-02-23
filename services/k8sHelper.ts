import Axios, { AxiosRequestConfig } from 'axios';
import moment from 'moment';
import { yellow } from '../helpers/colors';

export type AxiosConfig = AxiosRequestConfig & { clusterIndex: number };

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

export const getPods = (settings: AxiosConfig) =>
    Axios.get('/api/v1/pods', settings)
        .then(res => res.data)
        .then(res => res.items as any[])
        .catch(err => catchErr(err) as any[])
        .then(pods =>
            pods.map(pod => ({
                logLink: `${settings.clusterIndex}/pod/${pod.metadata.namespace}/${pod.metadata.name}`,
                name: pod.metadata.name as string,
                namespace: pod.metadata.namespace as string,
                node: pod.spec.nodeName as string,
                age: age(pod.metadata.creationTimestamp),
            })),
        );

export const getPodLog = (podName, namespace = 'default', settings: AxiosConfig) =>
    Axios.get(`/api/v1/namespaces/${namespace}/pods/${podName}/log`, settings)
        .then(res => res.data as string)
        .catch(err => catchErr(err, '') as string)
        .then(res => res.split('\n'));

export const getDeployments = async (settings: AxiosConfig) =>
    Axios.get('/apis/apps/v1/deployments', settings)
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
                logLink: `${settings.clusterIndex}/deployment/${deploy.metadata.namespace}/${deploy.metadata.name}`,
            })),
        );

export const getDeploymentLogs = async (deployName: string, namespace: string = 'default', settings: AxiosConfig) => {
    const pods = await getPods(settings);
    const matches = pods.filter(x => x.namespace === namespace && x.name.includes(deployName));
    const promises: any[] = [];
    const logs: string[] = [];

    for (let index = 0; index < matches.length; index++) {
        const pod = matches[index];
        promises.push(getPodLog(pod.name, pod.namespace, settings).then(log => logs.push(yellow('pod - ' + pod.name), ...log)));
    }

    await Promise.all(promises);
    return logs;
};

export const getServices = (settings: AxiosConfig) =>
    Axios.get('/api/v1/services', settings)
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

export const getNodes = (settings: AxiosConfig) =>
    Axios.get('/api/v1/nodes', settings)
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

export const getIngresses = (settings: AxiosConfig) =>
    Axios.get('/apis/extensions/v1beta1/ingresses', settings)
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
