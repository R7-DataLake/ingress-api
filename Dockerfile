FROM node:20-alpine AS build

LABEL maintainer="Satit Rianpit <rianpit@gmail.com>"

WORKDIR /home/api

COPY . .

RUN npm i && npm run build

RUN rm -rf src node_modules @types scripts

RUN npm i --omit=dev

FROM node:20-alpine

RUN npm i -g pm2

COPY --from=build /home/api /home/api

EXPOSE 3000

CMD ["pm2-runtime", "--json", "/home/api/process.json"]
