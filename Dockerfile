FROM node:latest
MAINTAINER DC <david.chobotsky@bizztreat.com>

WORKDIR /home

# Initialize
RUN git clone https://github.com/bizztreat/keboola-ex-itunes . && npm install

ENTRYPOINT node_modules/.bin/babel-node --presets es2015,stage-0 ./src/index.js --data=/data
