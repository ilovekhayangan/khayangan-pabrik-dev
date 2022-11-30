FROM node:16.16.0-slim as build
WORKDIR /app
#ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
#COPY package-lock.json ./
#RUN npm install -g npm@8.14.0

RUN npm install --legacy-peer-deps
#--force
#RUN npm ci --silent
#RUN npm install react-scripts@3.4.1 -g --silent
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]