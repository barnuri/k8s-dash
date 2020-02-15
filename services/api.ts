import Axios from 'axios';
import moment from 'moment';

let envBaseUrl = process.env.API_URL;

export const baseURL = () => {
    envBaseUrl = envBaseUrl || process.env.API_URL;
    return envBaseUrl || 'http://localhost:8001';
};

const axios = Axios.create({
    // timeout: 10000
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
    axios
        .get(baseURL() + '/api/v1/pods')
        .then(res => res.data)
        .then(res => res.items)
        .then(pods =>
            pods.map(pod => ({
                logLink: `/pod/${pod.metadata.namespace}/${pod.metadata.name}`,
                name: pod.metadata.name,
                namespace: pod.metadata.namespace,
                node: pod.spec.nodeName,
            })),
        )
        .catch(err => catchErr(err));

export const getPodLog = (podName, namespace = 'default') =>
    axios
        .get(baseURL() + `/api/v1/namespaces/${namespace}/pods/${podName}/log`)
        .then(res => res.data.split('\n'))
        .catch(err => catchErr(err, ''));

export const getDeployments = () =>
    axios
        .get(baseURL() + '/apis/apps/v1/deployments')
        .then(res => res.data)
        .then(res => res.items)
        .then(deployments =>
            deployments.map(deploy => ({
                name: deploy.metadata.name,
                namespace: deploy.metadata.namespace,
                ready: `${deploy.status.readyReplicas}/${deploy.status.replicas}`,
                allReplicasUp: deploy.status.readyReplicas === deploy.status.replicas,
                age: age(deploy.metadata.creationTimestamp),
            })),
        )
        .catch(err => catchErr(err));

export const getServices = () =>
    axios
        .get(baseURL() + '/api/v1/services')
        .then(res => res.data)
        .then(res => res.items)
        .then(services =>
            services.map(svc => ({
                name: svc.metadata.name,
                namespace: svc.metadata.namespace,
                clusterIP: svc.spec.clusterIP,
                type: svc.spec.type,
                ports: svc.spec.ports.map(port => `${port.port}/${port.protocol}`).join(', '),
                age: age(svc.metadata.creationTimestamp),
            })),
        )
        .catch(err => catchErr(err));

export const getNodes = () =>
    axios
        .get(baseURL() + '/api/v1/nodes')
        .then(res => res.data)
        .then(res => res.items)
        .then(nodes =>
            nodes.map(node => ({
                name: node.metadata.name,
                age: age(node.metadata.creationTimestamp),
                status: node.status.conditions.filter(x => x.status === 'True')[0].type,
                roles: Object.keys(node.metadata.labels)
                    .filter(x => x.includes('node-role.kubernetes.io/'))
                    .map(x => x.split('/')[1])
                    .join(', '),
                version: node.status.nodeInfo.kubeletVersion,
            })),
        )
        .catch(err => catchErr(err));

export const getIngresses = () =>
    axios
        .get(baseURL() + '/apis/extensions/v1beta1/ingresses')
        .then(res => res.data)
        .then(res => res.items)
        .then(ingresses =>
            ingresses.map(ingress => ({
                name: ingress.metadata.name,
                namespace: ingress.metadata.namespace,
                age: age(ingress.metadata.creationTimestamp),
                address: '',
                ports: '80',
                hosts: ingress.spec.rules.map(rule => rule.host).join(', '),
            })),
        )
        .catch(err => catchErr(err));
