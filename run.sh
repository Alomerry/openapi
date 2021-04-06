#! /bin/bash
# author:alomerry

cd ~/workspace/openapi/twitch/

pwd

echo "start pull code..."
whoami
git reset --hard origin/develop
git pull

echo "repository update success! "

cd ./twitch

mvn spring-boot:run