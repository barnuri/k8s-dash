# First Run Kubectl Proxy

```bash
kubectl proxy --address='0.0.0.0' --disable-filter=true --reject-methods="POST,PUT,PATCH"
```

# Run via K8s

```bash
export API_URL='http://localhost:8001'
export DASH_INGRESS_HOST='k8s-dash'
kubectl apply -f k8s-example.yaml
```

# Run via Docker

```bash
docker stop k8s-dash || true
docker rm k8s-dash || true
docker run -e API_URL="http://localhost:8001" --name k8s-dash -p 3000:3000 barnuri23/k8s-dash:latest
```
