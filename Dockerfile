FROM node:latest
MAINTAINER David Chobotsky <david.chobotsky@bizztreat.com>

WORKDIR /code

RUN git clone https://github.com/bizztreat/keboola-ex-itunes.git . && npm install

ENTRYPOINT node /code/run.js /data


#FROM radektomasek/keboola-base-node
#MAINTAINER DC <david.chobotsky@bizztreat.com>

#WORKDIR /code

#RUN yum update -y nss curl libcurl
# Initialize
#RUN git clone https://github.com/bizztreat/keboola-ex-itunes ./ && npm install



#ENTRYPOINT node_modules/.bin/babel-node --presets es2015,stage-0 ./src/index.js --data=/data
