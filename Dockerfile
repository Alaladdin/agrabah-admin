FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json .
RUN npm ci --foreground-scripts=true --audit=false --omit=dev

COPY . .
RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
