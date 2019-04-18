FROM node:alpine as builder
WORKDIR /app
COPY package.json .
RUN apk update && \
    apk upgrade && \
    apk add git
RUN npm install
COPY . .
RUN npm run -q build

FROM nginx
EXPOSE 80
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=0 app/dist /usr/share/nginx/html