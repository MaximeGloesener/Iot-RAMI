This is the front-end of an experimental project for the University of Mons. It is a Vue website that allows to manage
sensors and their data.

# Umons sensor frontend

- [Installation](#installation)
- [Install Node.js using NVM (Node Version Manager) is recommended.](#--install-nodejs-using-nvm-node-version-manager-is-recommended)
- [Development](#development)
- [Production](#production)
- [Linter](#linter)
- [Husky](#husky)
- [Environment variables](#environment-variables)
- [How to contribute](#how-to-contribute)
- [Continuous Integration (CI) with Gitlab](#continuous-integration-ci-with-gitlab)
- [Contributors](#contributors)

## Installation

### Clone the repository

```bash
git clone <repository>
```

### Install Node.js and npm

- You can find the installation instructions for Node.js on the official
  website: [Node.js](https://nodejs.org/en/download/)
- Use the LTS version.
- Install Node.js using NVM (Node Version Manager) is recommended.

### Install the dependencies with npm (first time only or when dependencies change)

```bash
npm install
```

## Development

### Launch the development server and the database

To do this see the readme of the [backend repository](https://gitlab.ig.umons.ac.be/rami/umons-sensor-backend).

### Start the server in development mode

Create a `.env.dev` file in the root directory of the project and add the following environment variables:

```bash
VITE_APP_BACK_URL=http://localhost:3000/api/v1
VITE_APP_TITLE=umons-sensor-backend (pre-prod)
```

Warning : make sure that the `VITE_APP_BACK_URL` variable is the same as the `NODE_PORT` variable in the `.env.dev` file
of the backend.

Then run the following command:

```bash
VITE_APP_ENV=dev npm run command dev
```

You can name the `.env.dev` file as you want, but you have to change the `VITE_APP_ENV` variable accordingly.

- The server will be available at http://localhost:8080
- The API will be available at http://localhost:3000
- The database will be available at http://localhost:5432

### Test with Vitest

```bash 
npm run test
```

```bash
 npm run test -- --coverage
```

## Production

### Build the frontend

```bash
cd frontend
npm run build
```

- Host the files in the `dist` folder on a web server.

## Linter

```bash
npm run lint
```

- We use [ESLint](https://eslint.org/) to lint the frontend and [Prettier](https://prettier.io/) to format the code.
- The configuration is in the `.eslintrc.cjs` file and `prettier.json` file.

## Husky

- Husky is a tool that allows you to run scripts when you commit or push your code
- The scripts are defined in the directory `.husky`
- You can find more information about Husky here: [Husky](https://typicode.github.io/husky/#/)
- There is a pre-commit hook that runs the linting

## Environment variables

- The environment variables are in the `.env` file.
- The environment variables are prefixed with `VITE_` to be accessible in the frontend.
- The environment variables are :
    - `VITE_API_URL` : the URL of the API

---

## How to contribute

This [documentation](./CONTRIBUTING.md) has been moved.

---

## Continuous Integration (CI) with Gitlab

- We use Gitlab to manage the project
- We use Gitlab CI to run the tests and the linting
- You can find more information about Gitlab CI here: [Gitlab CI](https://docs.gitlab.com/ee/ci/)
- The configuration of the CI is in the file `.gitlab-ci.yml`
- The CI is run when you push your code on the remote repository
- The CI is run on the branch `develop` and on `main`
- The CI is run on the following stages:
    - `lint`
    - `test`
    - `build`
    - `docker-build`

---

## Contributors

- Thomas Pont
- Lilian Soler









