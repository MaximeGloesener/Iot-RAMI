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
  - [Create a branch for the new feature](#create-a-branch-for-the-new-feature)
  - [Create a component](#create-a-component)
  - [Create composable and store (if needed)](#create-composable-and-store-if-needed)
  - [Create a view](#create-a-view)
  - [Add a new route](#add-a-new-route)
  - [Merge Request](#merge-request)
  - [Finish the feature](#finish-the-feature)
  - [Create a release](#create-a-release)

## Pre-requisites

On your local machine :

- Ensure git is installed (From the command line, type `git --version`). If you get a result, you have Git installed
- Install a source code editor, or decide which tool you’re going to use to edit files.
- Install git flow :
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
If you spot a problem with the project, search if an issue already exists [here](https://gitlab.ig.umons.ac.be/stage4a/umons-sensor-frontend/-/issues). If it does, add a comment to the existing. If it does not, create a new issue.

### Solve an issue
Scan through our existing issues to find one that interests you. You can narrow down the search using labels as filters. See Labels for more information. As a general rule, we don’t assign issues to anyone. If you find an issue to work on, you are welcome to open a MR with a fix.

## Create a branch for the new feature

- You need to create a new branch for the new feature you want to add to the project
- You can use the command `git flow feature start <feature_name>`

## Create a component

- You can create a new component in the `src/components` folder in typescript
- You must name the component with the PascalCase convention and the `.vue` extension (e.g. `MyComponent.vue`)

## Create composable and store (if needed)

- You can create a new composable in the `src/composables` folder in typescript
- You can create a new store in the `src/store` folder in typescript
- You must name the composable and the store with the PascalCase convention and the `.ts` extension (
  e.g. `MyComposable.ts`)
- Store are used to store the data of the application
- Composables are used to store the logic of the application
- You can find more information about the difference between store and composables
  here: [Store vs Composables](https://v3.vuejs.org/guide/composition-api-introduction.html#why-composition-api)

## Create a view

- You can create a new page in the `src/view` folder in typescript
- You must name the page with the PascalCase convention and the `.vue` extension (e.g. `MyPage.vue`)

## Add a new route

- You can add a new route in the `src/router/index.ts` file
- You can find more information about the router
  here: [Vue Router](https://router.vuejs.org/guide/#html)

## Merge Request

- You need to create a merge request to merge your branch into the branch `develop`
- A merge request is created on the web interface of gitlab or github
- You can find more information about merge request here:
    - [Gitlab](https://docs.gitlab.com/ee/user/project/merge_requests/)

## Finish the feature

- You need to finish the feature when the merge request is accepted
- You can use the command `git flow feature finish <feature_name>`
- You can use the command `git push --all` to push all the branches to the remote repository

## Create a release

- You need to create a release when the merge request is accepted
- You can use the command `git flow release start <release_name>`
- You have to update the version of the project in the file `package.json` and possibly in
  other files
- You can use the command `git flow release finish <release_name>`
- You can use the command `git push --all` to push all the branches to the remote repository
- You can use the command `git push --tags` to push all the tags to the remote repository
