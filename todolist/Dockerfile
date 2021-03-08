FROM node:12.7-alpine AS buildWeb
WORKDIR /usr/src/app
RUN apk add zip
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
WORKDIR /usr/src/app/dist/todolist
RUN zip -r html.zip ./
### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
RUN apk add unzip
WORKDIR /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=buildWeb /usr/src/app/dist/todolist/html.zip ./
RUN unzip -o html.zip