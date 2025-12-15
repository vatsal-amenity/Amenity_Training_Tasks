FROM node:24-alpine

WORKDIR /myapp

COPY package*.json .

RUN npm install

COPY . . 

RUN npm run build

RUN npm install -g serve

EXPOSE 5173

CMD ["npm","-s", "run", "dev"]