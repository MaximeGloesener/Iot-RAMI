# UMONS - Sensor Backend

This is the back-end of an experimental project for the University of Mons. It is a REST API that allows to manage
sensors and their data.

- [UMONS - Sensor Backend](#umons---sensor-backend)
    - [Installation](#installation)
        - [Install Docker and Docker Compose](#install-docker-and-docker-compose)
        - [Clone the repository](#clone-the-repository)
        - [Start the database with Docker](#start-the-database-with-docker)
        - [Docker Tips](#docker-tips)
        - [Install Node.js and npm](#install-nodejs-and-npm)
        - [Install the dependencies with npm (first time only or when dependencies change)](#install-the-dependencies-with-npm-first-time-only-or-when-dependencies-change)
    - [Development](#development)
        - [Database migrations and seed (first time only or when the database schema changes)](#database-migrations-and-seed-first-time-only-or-when-the-database-schema-changes)
        - [Start the server in development mode](#start-the-server-in-development-mode)
        - [Test the API with Postman](#test-the-api-with-postman)
        - [Test the API with jest](#test-the-api-with-jest)
        - [Jest Tips](#jest-tips)
    - [Documentation](#documentation)
    - [Linting](#linting)
    - [Production](#production)
    - [Husky](#husky)
    - [Environment variables](#environment-variables)
    - [How to contribute](#how-to-contribute)
    - [Continuous Integration (CI) with Gitlab](#continuous-integration-ci-with-gitlab)

## Installation

### Install Docker and Docker Compose

- You can find the installation instructions for Docker and Docker Compose on the official websites:

- [Docker](https://docs.docker.com/install/)
- [Docker Compose for Windows](https://docs.docker.com/compose/install/#install-compose-on-windows-systems)
- [Docker Compose for Mac](https://docs.docker.com/compose/install/#install-compose-on-macos)
- [Docker Compose for Linux](https://docs.docker.com/compose/install/#install-compose-on-linux-systems)

### Clone the repository

```bash
git clone <repository>
```

### Start the database with Docker

- First time only:

```bash
docker compose up -d node-db
```

- Every time you want to start the database:

```bash
docker compose start node-db
or
docker start <container_id>
```

### Docker Tips

- you can find the container id with the command `docker ps` or `docker ps -a`
- you can stop the database with the command `docker compose stop node-db` or `docker stop <container_id>`
- you can remove the database with the command `docker compose rm node-db` or `docker rm <container_id>`
- you don't need to write the full container id, you can write the first 3 or 4 characters

### Install Node.js and npm

- You can find the installation instructions for Node.js on the official
  website: [Node.js](https://nodejs.org/en/download/)
- Use the LTS version.
- Install Node.js using NVM (Node Version Manager) is recommended.

### Install the dependencies with npm (first time only or when dependencies change)

```bash
npm install
```

## Configuration file

To be sure to have the last version of the project, you should go to the `develop` branch with the
command `git checkout develop`.
You should create a file named `.env.development` at the root of the project. This file should contain the following :

```bash
DB_CONTAINER_NAME=umons-sensor-db-dev
DB_VERSION=13
DB_PORT_OUT=5432
DB_PORT_IN=5432
DB_USER=umons-sensor-dev
DB_PASSWORD=umons-sensor-dev
DB_NAME=umons-sensor-db-dev

NODE_ENV=development
NODE_PORT=3000
NODE_PORT_IN=3000
NODE_PORT_OUT=3000
NODE_CONTAINER_NAME=umons-sensor-dev

CI_REGISTRY_IMAGE=umons-sensor-dev
CI_COMMIT_SHA=latest

JWT_SECRET=umons-sensor-dev
JWT_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=10

DB_DIALECT=postgres
NODE_HOST=umons-sensor-db-production
PM2_INSTANCES=1
```

## Development

### Database migrations and seed (first time only or when the database schema changes)

You can use the following commands to create the database schema and seed it with some data:

```bash
NODE_ENV=development npm run command docker:build
NODE_ENV=development npm run command docker:start
```

If you are on Windows or Mac, make sure you have start Docker Desktop before running the previous commands.

### Start the server in development mode

```bash
NODE_ENV=development npm run command docker:init-db
```

If everything is good, you can now access the documentation of the API at the following
url: [http://localhost:3000/api/v1](http://localhost:3000/api/v1/docs). And, you can for exemple see the list of all
sensors at the following url: [http://localhost:3000/api/v1/sensors](http://localhost:3000/api/v1/sensors).

### Test the API with Postman

- Download and install Postman: [Postman](https://www.postman.com/downloads/)

### Test the API with jest

```bash
npm run test
```

### Jest Tips

- you can run a specific test file with the command `npm run test <file_name>`
- you can see the coverage with the command `npm run test -- --coverage`
- coverage is generated in the folder `coverage`
- you can see the coverage in the browser (index.html) or in the terminal
- some terminal have some extension to launch test and few other things

## Documentation

- The documentation is generated with [swagger](https://swagger.io/)
- The documentation is available at the following
  url: [http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs)

## Linting

- The linting is done with [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/)
- The linting rules are defined in the file `.eslintrc` and '.prettierrc.json'
- The linting is done automatically when you commit your code with [Husky](https://typicode.github.io/husky/#/)

## Production

- We use [PM2](https://pm2.keymetrics.io/) to run the server in production mode
- Use PM2 documentation to start the server in production mode and to manage it

## Husky

- Husky is a tool that allows you to run scripts when you commit or push your code
- The scripts are defined in the directory `.husky`
- You can find more information about Husky here: [Husky](https://typicode.github.io/husky/#/)
- There is a pre-commit hook that runs the linting

## Environment variables

- The environment variables are defined in the file `.env`
- The environment variables are :
    - NODE_ENV : the environment (development or production)
    - PORT : the port of the server
    - HOST : the host of the server
    - DB_NAME : the name of the database
    - DB_USER : the user of the database
    - DB_PASSWORD : the password of the database
    - DB_HOST : the host of the database
    - DB_PORT : the port of the database

---

## How to contribute

- This [documentation](./CONTRIBUTING.md) has been moved.

---

## Continuous Integration (CI) with Gitlab

- We use Gitlab to manage the project
- We use Gitlab CI to run the tests and the linting
- You can find more information about Gitlab CI here: [Gitlab CI](https://docs.gitlab.com/ee/ci/)
- The configuration of the CI is in the file `.gitlab-ci.yml`
- The CI is run when you push your code on the remote repository
- The CI is run on the branch `develop` and on `main`
- The CI is run on the following stages:
    - `.pre` :
        - linting
    - `build` :
        - build the project
    - `test` :
        - run the tests
        - coverage
    - `deploy` :
        - build dockers images
        - deploy the images on the registry
        - deploy the images on the server
        - run the database operations
