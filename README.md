# Quipucords UI
[![Build Status](https://github.com/quipucords/quipucords-ui/actions/workflows/integration.yml/badge.svg)](https://github.com/quipucords/quipucords-ui/actions/workflows/integration.yml)
[![License](https://img.shields.io/github/license/quipucords/quipucords-ui.svg)](https://github.com/quipucords/quipucords-ui/blob/main/LICENSE)

Web user interface for [Quipucords](https://github.com/quipucords/quipucords), based on [Patternfly](https://www.patternfly.org/)

## Development, Quick Start

### Requirements
Before developing, the basic requirements:
 * Your system needs to be running [NodeJS version 22+ and NPM](https://nodejs.org/)
    * Yarn install is discouraged. There are dependency install issues with Yarn `1.x.x` versions.
 * [podman desktop](https://podman-desktop.io/)

For in-depth tooling install guidance see the [contribution guidelines](./CONTRIBUTING.md#install-tooling)

### Installing
  1. Clone the repository
     ```
     $ git clone https://github.com/quipucords/quipucords-ui.git
     ```

  1. Within the repo context, install project dependencies
     ```
     $ cd quipucords-ui && npm install
     ```

### Develop
This is the base context for running a local UI against a mock API.

1. In a terminal instance that uses the repo context... Run
   ```
   $ npm start
   ```
1. Start developing against files in `./src`. Linting feedback will be automatically enabled through the terminal output

For in-depth local run guidance review the [contribution guidelines](./CONTRIBUTING.md#local-and-stage-development)

### Unit testing
Run and update unit tests while developing instead of after-the-fact. In a new terminal instance

1. In a new terminal instance that uses the repo context... Run
   ```
   $ npm run test:dev
   ```
2. Test files can be accessed, and edited, under `__test__` directories parallel to the files you're editing. Test failures for
   recently edited files will be available in the terminal output along with basic testing framework use directions.

For in-depth testing guidance review the [contribution guidelines](./CONTRIBUTING.md#testing)

## Contributing
Contributing encompasses [repository specific requirements](./CONTRIBUTING.md) and the global [contribution guidelines](https://github.com/quipucords/quipucords/blob/main/CONTRIBUTING.md).
