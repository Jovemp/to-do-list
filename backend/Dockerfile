FROM node:12.7-alpine as build
WORKDIR /app
RUN apk add zip
COPY ./package.json ./.sequelizerc ./yarn.* ./
RUN yarn
COPY . .
RUN yarn build
RUN zip -r dist.zip ./dist
#Imagem a ser Utilizada
FROM node:lts-alpine
WORKDIR /app
RUN apk add unzip
RUN apk --update add postgresql-client
RUN apk add bind-tools 
RUN apk add zip
COPY --from=build /app/package.json ./
COPY --from=build /app/.sequelizerc ./
COPY --from=build /app/dist.zip ./
COPY --from=build /app/wait-for-it.sh ./wait-for-it.sh 
RUN chmod +x wait-for-it.sh
RUN unzip dist.zip
RUN yarn
EXPOSE 3333
CMD "yarn" "start"