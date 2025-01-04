FROM node:lts-slim

WORKDIR /home/node/app

ARG NODE_ENV=$NODE_ENV
ARG PM2_PUBLIC_KEY=$PM2_PUBLIC_KEY
ARG PM2_SECRET_KEY=$PM2_SECRET_KEY
ARG DB_USER=$DB_USER
ARG DB_PASSWORD=$DB_PASSWORD
ARG DB_NAME=$DB_NAME
ARG DB_HOST=$DB_CONTAINER_NAME
ARG DB_DIALECT=$DB_DIALECT
ARG NODE_PORT_IN=$NODE_PORT_IN

# Ajout des variables Kafka
ARG KAFKA_BROKERS=$KAFKA_BROKERS
ARG KAFKA_CLIENT_ID=$KAFKA_CLIENT_ID
ARG KAFKA_GROUP_ID=$KAFKA_GROUP_ID

ENV NODE_ENV=$NODE_ENV
ENV PM2_PUBLIC_KEY=$PM2_PUBLIC_KEY
ENV PM2_SECRET_KEY=$PM2_SECRET_KEY
ENV DB_USER=$DB_USER
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_NAME=$DB_NAME
ENV DB_HOST=$DB_HOST
ENV DB_DIALECT=$DB_DIALECT
ENV NODE_PORT_IN=$NODE_PORT_IN
# Ajout des variables d'environnement Kafka
ENV KAFKA_BROKERS=$KAFKA_BROKERS
ENV KAFKA_CLIENT_ID=$KAFKA_CLIENT_ID
ENV KAFKA_GROUP_ID=$KAFKA_GROUP_ID


RUN npm install i npm@latest -g
RUN npm install pm2 -g

COPY package.json package-lock*.json ./

RUN npm install

COPY . .

RUN echo "{" > ./src/db/config.json  && echo "  \"$NODE_ENV\": { " >> ./src/db/config.json  && echo "    \"username\": \"$DB_USER\", " >> ./src/db/config.json  && echo "    \"password\": \"$DB_PASSWORD\", " >> ./src/db/config.json  && echo "    \"database\": \"$DB_NAME\", " >> ./src/db/config.json  && echo "    \"host\": \"$DB_HOST\", " >> ./src/db/config.json  && echo "    \"dialect\": \"$DB_DIALECT\", " >> ./src/db/config.json  && echo "    \"migrations-path\": \"../src/db/migrations\" " >> ./src/db/config.json  && echo "  } " >> ./src/db/config.json  && echo "}" >> ./src/db/config.json

RUN npm run build

EXPOSE $NODE_PORT_IN

CMD ["npm", "run", "command", "start"]
