docker stop k8s-dash || true 
docker rm k8s-dash || true 
docker build -t k8s-dash . 
docker run -e API_URL="http://localhost:8001" --name k8s-dash -p 3000:3000 k8s-dash
