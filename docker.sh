# kubectl proxy --address='0.0.0.0' --disable-filter=true
docker stop k8s-dash || true 
docker rm k8s-dash || true 
docker build -t k8s-dash . 
docker run -e API_URL="http://192.168.123.14:8001" --name k8s-dash -p 3000:3000 k8s-dash
