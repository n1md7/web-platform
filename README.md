# Template for Koa.js

## Start database

### MongoDb and MySql containers
```bash
docker-compose up
```

## Install dependencies

Back-end
```bash
npm install --prefix ./server
```

Front-end
```bash
npm install --prefix ./app
```

## Run migrations for MongoDb
```bash
npm run mongo:up
```

## Start development
```bash
npm run dev --prefix ./server
npm run start --prefix ./app

```