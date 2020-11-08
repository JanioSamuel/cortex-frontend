FROM node:12.18.4

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

ARG REACT_APP_URL

ENV REACT_APP_URL $REACT_APP_URL

COPY . .

CMD [ "npm", "start" ]
