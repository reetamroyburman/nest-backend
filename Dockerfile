FROM node:22-alpine

WORKDIR /user/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 9000

CMD ["node", "dist/src/main.js"]   