echo "Starting to deploy docker image.."
DOCKER_IMAGE=dockerimagessjsu/file_studio_docker_image:wall_street_backend
docker pull $DOCKER_IMAGE
docker ps -q --filter ancestor=$DOCKER_IMAGE | xargs -r docker stop
docker run -d --net=host  --name app-server $DOC  KER_IMAGE  -p 8080:8080