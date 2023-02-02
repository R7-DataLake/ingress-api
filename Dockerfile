FROM node:18-alpine AS build

LABEL maintainer="Satit Rianpit <rianpit@gmail.com>"

WORKDIR /home/api

RUN wget -qO /bin/pnpm "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" && chmod +x /bin/pnpm

COPY . .

RUN pnpm i && pnpm run build

RUN rm -rf node_modules

RUN pnpm i --production

RUN rm -rf src 

FROM keymetrics/pm2:18-slim

ENV NODE_ENV === 'production'

COPY --from=build /home/api /home/api

EXPOSE 3000

# CMD ["node", "/home/api/dist/server.js"]
CMD ["pm2-runtime", "--json", "/home/api/process.json"]
