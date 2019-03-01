# Quipucords UI
[![Build Status](https://travis-ci.org/quipucords/quipucords-ui.svg?branch=master)](https://travis-ci.org/quipucords/quipucords-ui)
[![codecov](https://codecov.io/gh/quipucords/quipucords-ui/branch/master/graph/badge.svg)](https://codecov.io/gh/quipucords/quipucords-ui)
[![License](https://img.shields.io/github/license/quipucords/quipucords-ui.svg)](https://github.com/quipucords/quipucords-ui/blob/master/LICENSE)

Web user interface for [Quipucords](https://github.com/quipucords/quipucords), based on [Patternfly <img src="https://www.patternfly.org/assets/img/logo.svg" height="30" />](https://www.patternfly.org/)

## Requirements
Before developing for Quipucords UI, the basic requirements:
 * Your system needs to be running [NodeJS version 10+](https://nodejs.org/)
 * [Docker](https://docs.docker.com/engine/installation/)
 * And [Yarn 1.12+](https://yarnpkg.com) for dependency and script management.

### Docker & Mac
Setting Docker up on a Mac? Install the appropriate package and you should be good to go. To check if everything installed correctly you can try these steps.
  * At a terminal prompt type

    ```
    $ docker run hello-world
    ```

### Docker & Linux
Setting Docker up on a Linux machine can include an additional convenience step. If you're having to prefix "sudo" in front of your Docker commands you can try these steps.
  * [Docker postinstall documentation](https://docs.docker.com/install/linux/linux-postinstall/)

### Yarn
 We recommend using [Homebrew](https://brew.sh/) to do the install.

  ```
  $ brew update
  $ brew install yarn
  ```

## Development

### Installing
  1. Clone the repository
     ```
     $ git clone https://github.com/quipucords/quipucords-ui.git
     ```

  1. Within the Quipucords UI repo, install project dependencies
     ```
     $ yarn
     ```

### Development Serve
This is the default context for running the UI with a local mock API. You need the base Quipucords UI requirements to run this context. 

Make sure **Docker** is running, then run
  ```
  $ yarn start
  ```
There are limitations in running against the mock serve, accuracy in API responses is much more lenient. This means server responses may not throw the appropriate errors where needed.
  
#### Debugging Redux
This project makes use of React & Redux. To enable Redux console logging, within the repository root directory, add a `.env.local` (dotenv) file with the follow line
  ```
  REACT_APP_DEBUG_MIDDLEWARE=true
  ```

Once you've made the change, restart the project and console browser logging should appear.


*Any changes you make to the `.env.local` file should be ignored with `.gitignore`.*

### Unit Testing
To run the unit tests with a watch during development you'll need to open an additional terminal instance, then run
  ```
  $ yarn test:dev
  ```

#### Updating snapshots
To update snapshots from the terminal run 
  ```
  $ yarn test:dev
  ```
  
From there you'll be presented with a few choices, one of them is "update", you can then hit the "u" key. Once the update script has run you should see additional changed files within Git, make sure to commit them along with your changes or testing will fail.

#### Checking code coverage
To check the coverage report from the terminal run
  ```
  $ yarn test
  ```
  
#### Code coverage failing to update?
If you're having trouble getting an accurate code coverage report, or it's failing to provide updated results (i.e. you renamed files) you can try running
  ```
  $ yarn test:clearCache
  ```

### Contributing
Contributing to Quipucords UI encompasses repository specific requirements and the global [Quipucords contribution guidelines](https://github.com/quipucords/quipucords/blob/master/CONTRIBUTING.rst). 

### Running with the Quipucords API toolset locally

Quipucords UI is the web user interface for [Quipucords](https://github.com/quipucords/quipucords). Please refer to [Quipucords](https://github.com/quipucords/quipucords) for up to date instructions on how to run.
