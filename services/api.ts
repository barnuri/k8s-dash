import * as k8sHelper from './k8sHelper';

let envBaseUrl = process.env.API_URL;
export const baseUrl = (): string[] => {
    envBaseUrl = envBaseUrl || process.env.API_URL;
    let tryParse;
    try {
        tryParse = JSON.parse(process.env.API_URL || '');
        envBaseUrl = tryParse || envBaseUrl;
    } catch {}
    if (Array.isArray(envBaseUrl)) {
        return envBaseUrl as string[];
    }
    return [envBaseUrl || 'http://localhost:8001'];
};

const axiosSettings: () => k8sHelper.AxiosConfig[] = () => {
    const basicSettings = {
        // timeout: 10000
        headers: { 'Access-Control-Allow-Origin': '*' },
    };
    return baseUrl().map(baseURL => ({ ...basicSettings, baseURL } as k8sHelper.AxiosConfig));
};

async function multiCluster<T>(method: (setting: k8sHelper.AxiosConfig) => Promise<T[]>) {
    const settings = axiosSettings();
    const promises: any[] = [];
    type resType = T & { cluster: string };
    const data: resType[] = [];

    let i = 0;
    for (const setting of settings) {
        promises.push(
            method({ ...setting, clusterIndex: i }).then(list =>
                data.push(...list.map(item => ({ cluster: setting.baseURL || '', clusterIndex: i, ...item }))),
            ),
        );
        i++;
    }
    await Promise.all(promises);
    return data;
}

export const getPods = () => multiCluster(setting => k8sHelper.getPods(setting));
export const getPodLog = (podName, namespace = 'default', clusterIndex: number) => k8sHelper.getPodLog(podName, namespace, axiosSettings()[clusterIndex]);
export const getDeployments = async () => multiCluster(setting => k8sHelper.getDeployments(setting));
export const getDeploymentLogs = (deployName: string, namespace: string = 'default', clusterIndex: number) =>
    k8sHelper.getDeploymentLogs(deployName, namespace, axiosSettings()[clusterIndex]);
export const getServices = () => multiCluster(setting => k8sHelper.getServices(setting));
export const getNodes = () => multiCluster(setting => k8sHelper.getNodes(setting));
export const getIngresses = () => multiCluster(setting => k8sHelper.getIngresses(setting));
