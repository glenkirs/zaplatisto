FROM node:16.13

ENV NODE_ENV=production

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
RUN npm i

COPY . /app

CMD ["bash", "start.sh"]
