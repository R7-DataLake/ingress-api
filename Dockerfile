FROM node:19-alpine AS build

LABEL maintainer="Satit Rianpit <rianpit@gmail.com>"

WORKDIR /home/api

ENV NODE_ENV === 'production'

COPY . .

RUN wget -qO /bin/pnpm "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" && chmod +x /bin/pnpm

RUN pnpm i && pnpm run build

RUN rm -rf node_modules

RUN pnpm i --production

RUN rm -rf src 

FROM node:19-alpine

RUN npm i -g pm2

COPY --from=build /home/api /home/api

EXPOSE 3000

CMD ["pm2-runtime", "--json", "/home/api/process.json"]
