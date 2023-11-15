FROM node:21-alpine AS build

WORKDIR /usr/app/frontend

COPY frontend/package.json .

RUN npm install

COPY frontend/ .

RUN npm run build

FROM nginx:latest AS nginx

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/app/frontend/dist /usr/share/nginx/html
