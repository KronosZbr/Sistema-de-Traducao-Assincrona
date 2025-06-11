FROM node:18-alpine

RUN apk add --no-cache netcat-openbsd

WORKDIR /app

COPY wait-for-it.sh ./
RUN chmod +x ./wait-for-it.sh

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3001

CMD ./wait-for-it.sh postgres 5432 -- ./wait-for-it.sh rabbitmq 5672 -- npm start