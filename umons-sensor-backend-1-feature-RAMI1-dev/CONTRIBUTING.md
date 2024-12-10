# Welcome to the contributing guide of the project

Thank you for your interest in the project and for your desire to contribute to it.

Read our [Code of Conduct](CODE_OF_CONDUCT.md) to keep our community friendly and respectful.

In this guide you will get an overview of the contribution workflow from opening an issue, to creating a merge request.

Use the table of contents to navigate through the guide.

- [Welcome to the contributing guide of the project](#welcome-to-the-contributing-guide-of-the-project)
    - [Pre-requisites](#pre-requisites)
    - [Issues](#issues)
        - [Create a new issue](#create-a-new-issue)
        - [Solve an issue](#solve-an-issue)
    - [Make changes](#make-changes)
        - [Make changes locally](#make-changes-locally)
            - [Create a branch for the new feature](#create-a-branch-for-the-new-feature)
            - [Create the new data](#create-the-new-data)
            - [Create the new routes and controllers](#create-the-new-routes-and-controllers)
            - [Create the new tests](#create-the-new-tests)
            - [Create the new documentation](#create-the-new-documentation)
            - [Commit your changes](#commit-your-changes)
            - [Merge Request](#merge-request)
            - [Your MR is merged!](#your-mr-is-merged)
        - [For maintainers only](#for-maintainers-only)
            - [Finish the feature](#finish-the-feature)
            - [Create a release](#create-a-release)

## Pre-requisites

On your local machine :

* Ensure git is installed (From the command line, type `git --version`. If you get a result, you have Git installed)
* Install a source code editor, or decide which tool you’re going to use to edit files.
* Install git flow :
    - You can find the installation instructions for git flow on the web
    - This tool is used to manage the branches and the releases of the project
    - You can find more information about git flow
      here: [git flow](https://www.atlassian.com/fr/git/tutorials/comparing-workflows/gitflow-workflow#:~:text=Qu'est%2Dce%20que%20Gitflow,Vincent%20Driessen%20de%20chez%20nvie.)
    - The default configuration is used
    - The default branch is `develop`
    - The default prefix for the branches is `feature/`, `bugfix/`, `release/` and `hotfix/`
    - The default prefix for the tags is `v`
    - The first time you use git flow, you need to initialize it with the command `git flow init`

## Issues

### Create a new issue

If you spot a problem with the project, search if an issue already
exists [here](https://gitlab.ig.umons.ac.be/stage4a/umons-sensor-backend/-/issues). If it does, add a comment to the
existing. If it does not, create a new issue.

### Solve an issue

Scan through our existing issues to find one that interests you. You can narrow down the search using labels as filters.
See Labels for more information. As a general rule, we don’t assign issues to anyone. If you find an issue to work on,
you are welcome to open a MR with a fix.

## Make changes

### Make changes locally

#### Create a branch for the new feature

- You need to create a new branch for the new feature you want to add to the project
- You can use the command `git flow feature start <feature_name>`

#### Create the new data

- You need to create the new data in the database
- Create new models in the folder `src/models` using [Sequelize](https://sequelize.org/docs/v6/other-topics/migrations/)
- Create new migrations in the folder `src/migrations`
  using [Sequelize](https://sequelize.org/docs/v6/other-topics/migrations/)
- Create new seeders in the folder `src/seeders`
  using [Sequelize](https://sequelize.org/docs/v6/other-topics/migrations/)
- You can use the command `npm run db:migrate` to create the new tables in the database
- You can use the command `npm run db:seed` to seed the new tables in the database
- Verify that the new data is created in the database using psql or another tool to manage the database

#### Create the new routes and controllers

- You need to create the new routes in the API
- Create new controllers in the folder `src/controllers`
- Create new routes in the folder `src/routes` :
    - Create a new file for the new routes
    - Create/Use middlewares if needed
    - Import their new routes in the file `src/routes/index.js`
- You can use the command `npm run dev` to start the server in development mode
- You can use Postman to test the new routes

#### Create the new tests

- You need to create the new tests for the new routes
- Create new tests in the folder `src/controllers/__tests__` using [Jest](https://jestjs.io/docs/en/getting-started)
- You can use the command `npm run test` to run the tests

#### Create the new documentation

- You need to create the new documentation for the new routes
- Create a new tag in the file `src/docs/tags.ts`
- Create a directory with the name of the new data in the folder `src/docs`
- Create a new file for the new routes in the folder `src/docs/<new_data>`
- Add the new routes in the file `src/docs/path.ts`
- You can use the command `npm run dev` to start the server in development mode
- You can use the url [http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs) to see the documentation

#### Commit your changes

Commit the changes once you are happy with them. Don't forget to self-review to speed up the review process.

#### Merge Request

- When you're finished with the changes, create a merge request, also known as a MR.
- You need to create a merge request to merge your branch into the branch `develop`
- A merge request is created on the web interface of gitlab
- You can find more information about merge request here:
    - [Gitlab](https://docs.gitlab.com/ee/user/project/merge_requests/)

#### Your MR is merged!

Congratulations! You are now a contributor to the project. Thank you for your contribution!

### For maintainers only

#### Finish the feature

- You need to finish the feature when the merge request is accepted
- You can use the command `git flow feature finish <feature_name>`
- You can use the command `git push --all` to push all the branches to the remote repository

#### Create a release

- You need to create a release when the merge request is accepted
- You can use the command `git flow release start <release_name>`
- You have to update the version of the project in the file `package.json` and `src/docs/basicInfo.ts` and possibly in
  other files
- You can use the command `git flow release finish <release_name>`
- You can use the command `git push --all` to push all the branches to the remote repository
- You can use the command `git push --tags` to push all the tags to the remote repository
