## Project Activity

![Alt](https://repobeats.axiom.co/api/embed/b22a4a0ea7d32d666f25f853cad1a8cff26d9d81.svg "Repobeats analytics image")

# ความต้องการของระบบ
1. Node.js 19.x
2. Redis Server 7.x
3. `pnpm` (https://pnpm.io/installation)

# วิธีการร่วมเขียนโค้ดด้วยกัน

1. Fork โปรเจค
2. Clone โปรเจคที่อยู่ใน repo ของตัวเอง 

```shell
$ git clone https://github.com/<username>/ingress-api.git
$ cd ingress-api
$ pnpm i
```
3. แก้ไขโค้ด
4. Push โค้ดขึ้น Repo ของตัวเอง
5. ทำ Pull request

## Environments

```env
NODE_ENV=development

R7PLATFORM_INGR_SECRET_KEY=xxx

R7PLATFORM_INGR_REDIS_HOST=localhost
R7PLATFORM_INGR_REDIS_PORT=6379
R7PLATFORM_INGR_REDIS_PASSWORD=admin
R7PLATFORM_INGR_REDIS_RATELIMIT_HOST=localhost \
R7PLATFORM_INGR_REDIS_RATELIMIT_PASSWORD=admin \
R7PLATFORM_METADATA_REDIS_HOST=localhost
R7PLATFORM_METADATA_REDIS_PORT=6379
R7PLATFORM_METADATA_REDIS_PASSWORD=admin
R7PLATFORM_LOG_REDIS_HOST=localhost
R7PLATFORM_LOG_REDIS_PORT=6379
R7PLATFORM_LOG_REDIS_PASSWORD=admin
R7PLATFORM_INGR_INTROSPECT_ENDPOINT=http://localhost:3001/token/introspect
R7PLATFORM_INGR_SERVICE_HOSTNAME=Little-Pony
```

## Run

```
NODE_ENV=development \
R7PLATFORM_INGR_REDIS_HOST=localhost \
R7PLATFORM_INGR_REDIS_PASSWORD=xxxxxx \
R7PLATFORM_INGR_REDIS_RATELIMIT_HOST=localhost \
R7PLATFORM_INGR_REDIS_RATELIMIT_PASSWORD=xxxxx \
R7PLATFORM_INGR_SECRET_KEY=xxxxxxxx \ 
R7PLATFORM_METADATA_REDIS_PASSWORD=xxxxxx \
R7PLATFORM_METADATA_SECRET_KEY=xxxxxxxx \ 
R7PLATFORM_LOG_REDIS_PASSWORD=xxxxxx \
R7PLATFORM_LOG_SECRET_KEY=xxxxxxxx \ 
R7PLATFORM_INGR_INTROSPECT_ENDPOINT=http://localhost:3001/token/introspect \
npm start
```
