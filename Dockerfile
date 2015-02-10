FROM node

RUN npm install -g mocha
RUN npm install -g istanbul

COPY . /src
RUN cd /src; npm install
WORKDIR /src

EXPOSE 3000
