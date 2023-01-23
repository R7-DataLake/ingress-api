# ความต้องการของระบบ
1. Node.js 18.x
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

INGR_SECRET_KEY=xxx

INGR_REDIS_HOST=localhost
INGR_REDIS_PORT=6379
INGR_REDIS_PASSWORD=admin
INGR_QUEUE_NAME=R7QUEUE

INGR_R7_SERVICE_HOSTNAME=Little-Pony
```

## Run

```
NODE_ENV=development INGR_REDIS_PASSWORD=xxxxxx INGR_QUEUE_NAME=MAHASARAKHAM npm start
```