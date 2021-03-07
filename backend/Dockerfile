#Imagem a ser Utilizada
FROM node:12-alpine

ENV DB_DIALECT=sqlite

RUN apk add g++ make python

#Criando a pasta aonde vai ficar api e dando permicao 
RUN mkdir -p /home/node/api/node_modules && mkdir -p /home/node/api/src && mkdir -p /home/node/api/__tests__ && chown -R node:node /home/node/api 

#Setando a pasta como local padrao
WORKDIR /home/node/api

#Copiando do projeto para o docker os arquivos pachage.json e os com nome yarn para diretorio padrao
COPY package.json .sequelizerc yarn.* ./

#Setando usuario
USER node

#Rodando yarn na pasta para copiar dependencias
RUN yarn --production 

#copiando a pasta inteira
COPY --chown=node:node ./dist/ ./src/

#Expondo a portas para acesso
EXPOSE 3333

CMD yarn sequelize db:migrate && node ./src/server.js