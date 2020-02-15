FROM node:alpine as builder

RUN mkdir -p /app/
WORKDIR /app/
COPY package*.json ./
RUN npm i
COPY . .
ENV PATH="./node_modules/.bin:$PATH"
ENV NODE_ENV production
RUN npm run tsc
RUN npm run build
CMD [ "npm", "run", "prod"]
