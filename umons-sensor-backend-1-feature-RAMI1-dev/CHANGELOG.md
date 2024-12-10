# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

- [Changelog](#changelog)
    - [\[Unreleased\]](#unreleased)
    - [\[1.5\] - 2023-06-20](#15---2023-06-20)
        - [Added](#added)
    - [\[1.4\] - 2023-06-15](#14---2023-06-15)
        - [Added](#added-1)
        - [Fixed](#fixed)
    - [\[1.3.2\] - 2023-06-09](#132---2023-06-09)
        - [Added](#added-2)
        - [Fixed](#fixed-1)
        - [Changed](#changed)
        - [Removed](#removed)
    - [\[1.3\] - 2023-06-09](#13---2023-06-09)
        - [Added](#added-3)
        - [Fixed](#fixed-2)
        - [Changed](#changed-1)
        - [Removed](#removed-1)
    - [\[1.2\] - 2023-05-06](#12---2023-06-05)
        - [Added](#added-4)
        - [Fixed](#fixed-3)
        - [Changed](#changed-2)
    - [\[1.1\] - 2023-05-25](#11---2023-05-25)
        - [Added](#added-5)
    - [\[1.0\] - 2023-05-25](#10---2023-05-23)
        - [Added](#added-6)

## [Unreleased]

### Added

- [#18 Allow post array of measurements](https://gitlab.ig.umons.ac.be/rami/umons-sensor-backend/-/commit/f164083047375ce3b6a57a238f09369cfefb8a1f) ([merge request](https://gitlab.ig.umons.ac.be/rami/umons-sensor-backend/-/merge_requests/9))
- [#10 Add environment file in gitlab secret](https://gitlab.ig.umons.ac.be/rami/umons-sensor-backend/-/commit/54d7168a45f01b56bda8350b2107830c33bd5461) ([merge request](https://gitlab.ig.umons.ac.be/rami/umons-sensor-backend/-/merge_requests/8))

### Changed

- [#20 Optimization of bulk]() ([merge request](https://gitlab.ig.umons.ac.be/rami/umons-sensor-backend/-/merge_requests/12))

## [1.5] - 2023-06-20

### Added

- [#5 Allow to choose by sample rate in measurements search](https://gitlab.ig.umons.ac.be/stage4a/umons-sensor-backend/-/commit/14c8755d4d9a489de8e8e2681fb7357975295922) ([merge request](https://gitlab.ig.umons.ac.be/stage4a/umons-sensor-backend/-/merge_requests/4))
- [#4 Sort measurements by date in descending order](https://gitlab.ig.umons.ac.be/stage4a/umons-sensor-backend/-/commit/73973fb72c1595c10c95aa1278c1d24c583f3251) ([merge request](https://gitlab.ig.umons.ac.be/stage4a/umons-sensor-backend/-/merge_requests/3))
- [#3 Add changelog and contributing files](https://gitlab.ig.umons.ac.be/stage4a/umons-sensor-backend/-/commit/ac6b9381a464a51f7e71d5356b12b979b8f0609b) ([merge request](https://gitlab.ig.umons.ac.be/stage4a/umons-sensor-backend/-/merge_requests/2))

## [1.4] - 2023-06-15

### Added

- Continuous deployment to ig cluster (prod and preprod)
- Multiple environments (dev, preprod, prod) with different configurations (docker-compose.yml, .env,...)
- PM2 for production environment (preprod and prod) with cluster mode
- Home page

### Fixed

- Build issues

## [1.3.2] - 2023-06-09

### Added

- Module name mapping in tsconfig.json
- A very restrictive tsc config

### Fixed

### Changed

- Rewrite all files with module name mapping

### Removed

- Useless files (dotenv,...)

## [1.3] - 2023-06-09

### Added

- CRUD for measurements
- Documentation for measurements
- Tests for measurements

### Fixed

- README.md

### Changed

- Build and test before each commit
- More seed data
- Tests for sensors and measurement types linked to measurements

### Removed

## [1.2] - 2023-06-05

### Added

- Build and push docker images to docker registry in CI/CD pipeline
- Search sensor by name

### Fixed

- README.md

### Changed

- Ecma version from 2018 to latest

## [1.1] - 2023-05-25

### Added

- CRUD for measurement types
- Documentation for measurement types
- Tests for measurement types

## [1.0] - 2023-05-23

### Added

- Initial version of the API
- Initial CI/CD pipeline
- Initial version of the database
- Initial README.md
- Initial docker-compose.yml