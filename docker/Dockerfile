FROM node:16.13 as builder

ENV NODE_ENV=production

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
RUN npm i

COPY . /app

CMD ["bash", "start.sh"]

FROM nginx:1.16-alpine
ADD ./docker/vhost.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build/ /app/