FROM node:19.4.0

RUN mkdir -p /node/app
WORKDIR /node/app
COPY package*.json ./

RUN npm ci
COPY . .

EXPOSE 3000
ENTRYPOINT [ "npm", "start" ]