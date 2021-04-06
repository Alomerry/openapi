#! /bin/bash
# author:alomerry

cd ~/workspace/openapi/twitch/

pwd

echo "start pull code..."
whoami
git reset --hard origin/feat-twitch-api
git pull

echo "repository update success! "

mvn spring-boot:run