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
COPY . ./

RUN npm run build

# production environment
FROM nginx:stable-alpine

#COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/build /usr/share/nginx/html
# new
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
