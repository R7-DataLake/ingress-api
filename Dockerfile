FROM node:19-alpine AS build

LABEL maintainer="Satit Rianpit <rianpit@gmail.com>"

WORKDIR /home/api

COPY . .

RUN npm i && npm run build

RUN rm -rf node_modules

RUN npm i --production

RUN rm -rf src 

FROM node:19-alpine

ENV NODE_ENV === 'production'

RUN npm i -g pm2

COPY --from=build /home/api /home/api

EXPOSE 3000

# CMD ["node", "/home/api/dist/server.js"]
CMD ["pm2-runtime", "--json", "/home/api/process.json"]
