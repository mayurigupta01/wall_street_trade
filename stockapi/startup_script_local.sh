#!/bin/bash

export FLASK_APP="main.py"
export FLASK_ENV="development"
export LC_ALL=en_US.UTF8

cd /code/wall-street-trade/stockapi

#touch ./cert.pem
#touch ./key.pem
#chmod 666 ./cert.pem
#chmod 666 ./key.pem
#cat ./test_container_required.json | jq -r '.ssl_cert' > ./cert.pem
#cat ./test_container_required.json | jq -r '.ssl_key' > ./key.pem
#chmod 400 ./cert.pem
#chmod 400 ./key.pem
flask run --host=0.0.0.0 --port=443 --cert=cert.pem --key=key.pem


# touch ./cert.pem
# touch ./key.pem
# chmod 666 ./cert.pem
# chmod 666 ./key.pem
# cat ./test_container_required.json | jq -r '.ssl_cert' > ./cert.pem
# cat ./test_container_required.json | jq -r '.ssl_key' > ./key.pem
# chmod 400 ./cert.pem
# chmod 400 ./key.pem

