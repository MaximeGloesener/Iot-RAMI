# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
ARG VITE_APP_ENV=$VITE_APP_ENV
ARG VITE_APP_PORT_IN=$VITE_APP_PORT_IN
ARG VITE_APP_BACK_URL=$VITE_APP_BACK_URL

ENV VITE_APP_ENV=$VITE_APP_ENV
ENV VITE_APP_PORT_IN=$VITE_APP_PORT_IN
ENV VITE_APP_BACK_URL=$VITE_APP_BACK_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN VITE_APP_ENV=$VITE_APP_ENV npm run command build
RUN echo $VITE_APP_BACK_URL > /app/dist/env.$VITE_APP_ENV


# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

ENV VITE_APP_ENV=$VITE_APP_ENV
ENV VITE_APP_PORT_IN=$VITE_APP_PORT_IN
ENV VITE_APP_BACK_URL=$VITE_APP_BACK_URL

EXPOSE $VITE_APP_PORT_IN

CMD ["nginx", "-g", "daemon off;"]

