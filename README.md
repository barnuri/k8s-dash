# First Run Kubectl Proxy

```bash
kubectl proxy --address="0.0.0.0" --disable-filter=true --reject-methods="POST,PUT,PATCH"
```

# Run via K8s

## Install

### donwload file
```bash
curl https://raw.githubusercontent.com/barnuri/k8s-dash/master/k8s.yaml -o ./k8s.yaml
```

### linux
```bash
export API_URL='http://localhost:8001'
export DASH_INGRESS_HOST='k8s-dash'
cat k8s.yaml | envsubst | kubectl apply -f -
```

### windows
```powershell
$API_URL='http://localhost:8001'
$DASH_INGRESS_HOST='k8s-dash'
gc k8s.yaml | foreach { $ExecutionContext.InvokeCommand.ExpandString($_) } | kubectl apply -f -
```

## Repull image of existing deploy

### linux
```bash
kubectl patch deployment k8s-dash -p "{\"spec\":{\"template\":{\"metadata\":{\"annotations\":{\"date\":\"`date +'%s'`\"}}}}}"
```

### windows
```powershell
kubectl patch deployment k8s-dash -p (-join("{\""spec\"":{\""template\"":{\""metadata\"":{\""annotations\"":{\""date\"":\""" , $(Get-Date -Format o).replace(':','-').replace('+','_') , "\""}}}}}"))
```

# Run via Docker

```bash
docker stop k8s-dash
docker rm k8s-dash
docker run -e API_URL="http://localhost:8001" --name k8s-dash -p 3000:3000 barnuri23/k8s-dash:latest
```

