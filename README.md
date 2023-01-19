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
API_TOKEN=xxx
NODE_ENV=development
SECRET_KEY=xxx

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USER=default
REDIS_PASSWORD=789124
QUEUE_NAME=MAHASARAKHAM
```

## Run

```
NODE_ENV=development REDIS_USER=default REDIS_PASSWORD=xxxxxx QUEUE_NAME=MAHASARAKHAM npm start
```