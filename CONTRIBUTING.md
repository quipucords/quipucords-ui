# Contributing
Contributing to Quipucords UI encompasses repository specific requirements and the global [Quipucords contribution guidelines](https://github.com/quipucords/quipucords/blob/master/CONTRIBUTING.md).

## Commits
In an effort to bring in future automation around 
[CHANGELOG.md](./CHANGELOG.md) and tagging we make use of [Standard Version](https://github.com/conventional-changelog/standard-version#readme) and [Conventional Commits](https://www.conventionalcommits.org).

It's encouraged that commit messaging follow the format
```
   <type>[optional scope]: <issue number><description>
```


## Build
### dotenv files
Our current build leverages `dotenv`, or `.env*`, files to apply environment build configuration. 

There are currently build processes in place that leverage the `.env*.local` files, these files are actively applied in our `.gitignore` in order to avoid build conflicts. They should continue to remain ignored, and not be added to the repository.

Specific uses:
- `env.local`, is used for development purposes typically around displaying Redux logging
- `.env.production.local`, is used by the build to relate build information, i.e. versioning

## Serving Content
To serve content you'll need to have Docker, Node, and Yarn installed.

Serving content comes in 3 variations
- `$ yarn start`, Development local run, randomized mock data. 
  
  The cons to this are the randomized mock data, it gets weird.
- `$ yarn start:stage`, Development local run, unstyled login, all while volumed into an API Docker container. 
   
  You'll be asked for the default credentials in an unstyled login. You should be able to update the associated database, and run actual scans.
- `$ yarn start:review`, An approximation of production. 
  
  Useful for testing the build and avoiding package install problems, since most of it is through Docker. You'll be asked for the default credentials. You should be able to update the associated database, and run actual scans.

## Testing
To test content you'll need to have Node and Yarn installed.

### Code Coverage Requirements
Updates that drop coverage below the current threshold will need to have their coverage expanded accordingly before being merged. 

Settings for the Jest aspect of code coverage can be found in [package.json](./package.json). Settings for the CI reporting level of code coverage
can be found in [.codecov.yml](./.codecov.yml).

### Debugging and Testing

#### Debugging Redux
This project makes use of React & Redux. To enable Redux console logging, within the repository root directory, add a `.env.local` (dotenv) file with the follow line
  ```
  REACT_APP_DEBUG_MIDDLEWARE=true
  ```

Once you've made the change, restart the project and console browser logging should appear.

*Any changes you make to the `.env.local` file should be ignored with `.gitignore`.*

#### Unit Testing
To run the unit tests with a watch during development you'll need to open an additional terminal instance, then run
  ```
  $ yarn test:dev
  ```

##### Updating test snapshots
To update snapshots from the terminal run 
  ```
  $ yarn test:dev
  ```
  
From there you'll be presented with a few choices, one of them is "update", you can then hit the "u" key. Once the update script has run you should see additional changed files within Git, make sure to commit them along with your changes or testing will fail.

##### Checking code coverage
To check the coverage report from the terminal run
  ```
  $ yarn test
  ```
  
##### Code coverage failing to update?
If you're having trouble getting an accurate code coverage report, or it's failing to provide updated results (i.e. you renamed files) you can try running
  ```
  $ yarn test:clearCache
  ```

## Generated content
This repository creates, and has, some interdependency on both [Quipucords](https://github.com/quipucords/quipucords) and [Quipudocs](https://github.com/quipucords/quipudocs)

### Django templates, login and logout
In order to have GUI developer access to the login and logout aspects of [Quipucords](https://github.com/quipucords/quipucords) we house
the Django template files here [./templates/*](./templates/base.html).

#### Important!
- This templates directory is required as part of the build process. **Removing `./templates` directory will break the production build.**
- Updating the templates requires minimal understand of html, plus some minor recognition of templating languages. [If needed checkout out the Django template structure reading](https://docs.djangoproject.com/en/2.1/topics/templates/).
- We use a shell script token string replacement during the build process for the application display name. If you see **[UI_NAME]** within the templates, be aware.
- [The build script for directly manipulating the templates is here, ./scripts/post.sh](./scripts/post.sh) 

### Documentation, locale and help guides
[Quipudocs](https://github.com/quipucords/quipudocs) houses our locale and help guide setup through an NPM dependency layout, [see our package.json for Quipudocs](./package.json).

#### Important!
- We do not store locale and help guide documentation with the UI repo. Any updates to those locations will be overwritten during the build process.
- To handle locale string replacement during GUI development it is important to utilize fallback strings because of this separation, that GUI code has the appearance of `t(someKey, 'my fallback string'')`.
- [The build script for directly manipulating the locale and help guides is here, ./scripts/quipudocs.js](./scripts/quipudocs.js)

### Brand build
The brand build updates aspects of the application name across the React and Django templates. 
To handle a branded aspect of the build, instead of `yarn build`, run

   ```
   $ yarn build:brand
   ```

## Typical Workflow
After setting up the repository...
1. Make sure you've installed your packages, and Docker is running
1. Open a couple of instances of Terminal and run...
    ```
    $ yarn start:stage
    ```
    and, optionally,
    ```
    $ yarn test:dev
    ```
1. Make sure your browser opened around the domain `https://localhost:5001`
1. Start developing...
