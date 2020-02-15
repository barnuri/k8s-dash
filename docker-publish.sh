docker login
docker build -t k8s-dash . 
docker tag k8s-dash barnuri23/k8s-dash:latest
docker push barnuri23/k8s-dash:latest
