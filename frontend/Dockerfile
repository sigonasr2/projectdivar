# pull official base image
FROM node:13.12.0-alpine

RUN mkdir -p /app
WORKDIR /app
EXPOSE 3000

ENV PATH /app/node_modules/.bin:$PATH

COPY . /app

RUN npm install -y --silent
RUN npm rebuild node-sass

CMD ["npm", "start"]