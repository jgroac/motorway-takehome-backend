# 🚗 motorway takehome test

### Prerequisite:
 - docker (https://docs.docker.com/get-docker/)
 - node 18.4 or greater (https://nodejs.org/en)


### Getting started

1. To initialize this project, run:

```sh
docker-compose build && docker-compose up
```

2. Send a request GET to the following URL `http://localhost:3030/vehicles/1?timestamp=2022-09-12%2010%3A00%3A00%2B00`, example:


``` bash
curl "http://localhost:3000/vehicles/1?timestamp=2022-09-12%2010%3A00%3A00%2B00"
```

3. response should be the following;
```json
{
  "id":"1",
  "make":"BMW",
  "model":"X1",
  "state":"quoted"
}
```

### Development
1. Install dependencies

```sh
npm install
```

2. Create .env.test

```bash
cp .env.example .env.test
```

3. Run tests

```bash
npm run test
```


### Folder Structure

`config/`: Env variables load and configuration files.

`controllers/`: Controllers that handle incoming requests and responses.

`database/`: Database setup, migrations and models.

`exceptions/`: App exceptions and exception handler.

`middleware/`: App middlewares, but the exception handler.

`repository/`: All business logic related to data.

`routes/`: Routes definitions.

`utils/`: It includes the logger setup.


### Wrap-up
- I've dockerised the app and added a redis server, to ensure we only hit the db if necessary, current TTL for the redis cache is 60s.
- Use domain driven design and move the data layer to a repository for clarity.
- Use knex to make easier to make easier migration creation, data retrieval, prevent sql injection and reduce test boilerplate.
- Use a simple GHA pipeline to lint and run test on push
- Missing bits, that would love to add with more time:
  - Validation to the .env variables, at the vary minimum ensure existence
  - Performance tests
  - Deploy it somewhere