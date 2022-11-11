# /bin/bash

# This script will run the test in a Docker container
docker compose --file docker-compose.test.yml up --build --exit-code-from website