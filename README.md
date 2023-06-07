# Quipucords UI
[![Build Status](https://github.com/quipucords/quipucords-ui/actions/workflows/integration.yml/badge.svg)](https://github.com/quipucords/quipucords-ui/actions/workflows/integration.yml)
[![codecov](https://codecov.io/gh/quipucords/quipucords-ui/branch/master/graph/badge.svg)](https://codecov.io/gh/quipucords/quipucords-ui)
[![License](https://img.shields.io/github/license/quipucords/quipucords-ui.svg)](https://github.com/quipucords/quipucords-ui/blob/master/LICENSE)

Web user interface for [Quipucords](https://github.com/quipucords/quipucords), based on [Patternfly](https://www.patternfly.org/)

## Requirements
Before developing, the basic requirements:
   * Your system needs to be running [NodeJS version 18+ and NPM](https://nodejs.org/)
   * [Docker](https://docs.docker.com/desktop/)
      * Alternatively, you can try [Podman](https://github.com/containers/podman).
   * And [Yarn](https://yarnpkg.com) for dependency and script management.

For in-depth tooling install guidance see the [contribution guidelines](./CONTRIBUTING.md#Install)

## Development, Quick Start

### Installing
  1. Clone the repository
     ```
     $ git clone https://github.com/quipucords/quipucords-ui.git
     ```

  1. Within the repo context, install project dependencies
     ```
     $ cd quipucords-ui && yarn
     ```

### Serving Content
This is the default context for running a local UI with a randomized mock API. 

Make sure **Docker** is running, then run
  ```
  $ yarn start
  ```

For in-depth local run guidance review the [contribution guidelines](./CONTRIBUTING.md#Serving%20Content)

### Testing
Run the tests with coverage.

  ```
  $ yarn test
  ```
  
For in-depth testing guidance review the [contribution guidelines](./CONTRIBUTING.md#Testing)

## Contributing
Contributing encompasses [repository specific requirements](./CONTRIBUTING.md) and the global [contribution guidelines](https://github.com/quipucords/quipucords/blob/master/CONTRIBUTING.md).
