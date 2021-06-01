Node.js version required ^15

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

## Run migrations
```bash
npm run migrations
```

## Start development
```bash
npm run dev --prefix ./server
npm run start --prefix ./app

```

Swagger endpoint http://localhost:8080/swagger

Database schema
![diagram.svg](docs/img/db.diagram.svg)