# Contributing
Contributing encompasses repository specific requirements, and the global [Quipucords contribution guidelines](https://github.com/quipucords/quipucords/blob/master/CONTRIBUTING.md).

## Process
<details>
<summary><h3 style="display: inline-block">Using Git</h3></summary>

Quipucords-UI makes use of
- GitHub's fork and pull workflow.
- A linear commit process and rebasing.

> Instead of relying on GitHub merge commits and squashing, we recommend breaking down changes into smaller, independent commits.

> Working directly on the main repository is discouraged.

#### Branch syncing
Linear commit history for Quipucords-UI makes syncing concise
- `dev` is always rebased from `main`
  - typically after a release
  - or in prep for a fast-forward of `main`
- `main` is fast-forwarded from `dev`
  - typically when commits are prepared for release

</details>

<details>
<summary><h3 style="display: inline-block">Pull request workflow, and testing</h3></summary>

All development work should be handled through GitHub's fork and pull workflow.

#### Setting up a pull request
When multiple developers are contributing features, development pull requests (PRs) should be opened against the `dev` branch. PRs directly to `main` are discouraged, 
Exceptions are allowed, but it is important to ensure that updates to the `main` branch are also rebased against the `dev` branch.

> If your pull request work contains any of the following warning signs
>  - out of sync commits (is not rebased against the `base branch`)
>  - poorly structured commits and messages
>  - any one commit relies on other commits to work at all, in the same pull request
>  - dramatic file restructures that attempt complex behavior
>  - missing, relaxed, or removed unit tests
>  - dramatic unit test snapshot updates
>  - affects any file not directly associated with the issue being resolved
>  - affects "many" files
>
> You may be encouraged to restructure your commits to help in review.

#### Pull request commits, messaging

Your pull request should contain Git commit messaging that follows the use of [conventional commit types](https://www.conventionalcommits.org/)
to provide consistent history and help generate [CHANGELOG.md](./CHANGELOG.md) updates.

Commit messages follow three basic guidelines
- No more than `65` characters for the first line
- If your pull request has more than a single commit you should include the pull request number in your message using the below format. This additional copy is not counted towards the `65` character limit.
  ```
  [message] (#1234)
  ```

  You can also include the pull request number on a single commit, but
  GitHub will automatically apply the pull request number when the
  `squash` button is used on a pull request.

- Commit message formats follow the structure
  ```
  <type>(<scope>): <issue number><description>
  ```
  Where
  - Type = the type of work the commit resolves.
    - Basic types include `feat` (feature), `fix`, `chore`, `build`.
    - See [conventional commit types](https://www.conventionalcommits.org/) for additional types.
  - Scope = **optional** area of code affected.
    - Can be a directory or filenames
    - Does not have to encompass all file names affected
  - Issue number = the Jira issue number
    - Currently, the prefix `dis-[issue number]` can be used in place of `discovery-[issue number]`
  - Description = what the commit work encompasses

  Example
  ```
  feat(scans): dis-123 activate foo against bar
  ```
> Not all commits need an issue number. But it is encouraged you attempt to associate
> a commit with an issue for tracking. In a scenario where no issue is available
> exceptions can be made for `fix`, `chore`, and `build`.

#### Pull request test failures
Creating a pull request activates the following checks through GitHub actions.
- Commit message linting, see [commit_lint.yml](./.github/workflows/commit_lint.yml)
- Pull request code linting, unit tests and repo-level integration tests, see [integration.yml](./.github/workflows/integration.yml)

For additional information on failures for
- Commit messages, see [Pull request commits, messaging](#pull-request-commits-messaging)
- Code documentation, see [Updating code documentation]()
- Pull request code, see [Updating unit tests during development]()

> To resolve failures for any GitHub actions make sure you first review the results of the test by
clicking the `checks` tab on the related pull request.

> Caching for GitHub actions and NPM packages is active. This caching allows subsequent pull request
> updates to avoid reinstalling yarn dependencies.
>
> Occasionally test failures can occur after recent NPM package updates either in the pull request
> itself or in a prior commit to the pull request. The most common reason for this failure presents when
> a NPM package has changed its support for different versions of NodeJS and those packages are updated
> in the `dev` branch.
>
> If test failures are happening shortly after a NPM package update you may need to clear the
> GitHub actions cache and restart the related tests.

</details>

<details>
<summary><h3 style="display: inline-block">Releasing code for all environments</h3></summary>

Quipucords-UI makes use of release artifacts.

> After pushing code, or tagging, a repository GitHub action starts the process of creating artifacts.

#### Release artifacts
To create release artifacts a maintainer must run the release commit process locally.

   ```
   local main repo, main branch -> release commit -> origin main -> tag -> GitHub action
   ```

1. clone the main repository, within the repo confirm you're on the `main` branch and **SYNCED** with `origin` `main`
1. run
   1. `$ git checkout main`
   1. `$ yarn`
   1. `$ yarn release --dry-run` to confirm the release output version and commits.
   1. `$ yarn release` to generate the commit and file changes.

      >If the version recommended should be different you can run the command with an override version following a semver format
      >  ```
      >  $ yarn release --override X.X.X
      >  ``` 
1. Confirm you now have a release commit with the format `chore(release): X.X.X` and there are updates to
   - [`package.json`](./package.json)
   - [`CHANGELOG.md`](./CHANGELOG.md)

   If there are issues with the file updates you can correct them and squish any fixes into the `chore(release): X.X.X` commit
1. Push the **SINGLE** commit to `origin` `main`
1. Using the [Quipucords-UI GitHub releases interface](https://github.com/RedHatInsights/quipucords-ui/releases)
   1. Draft a new release from `main` confirming you are aligned with the `chore(release): X.X.X` commit hash
   1. Create the new tag using the **SAME** semver version created by the release commit, i.e. `X.X.X`.

   > To avoid issues with inconsistent Git tagging use it is recommended you use the GitHub releases interface.

</details>

<details>
<summary><h3 style="display: inline-block">NPM maintenance</h3></summary>

#### Cycle for updating NPMs
Our schedule for updating NPMs
- dependabot running once a month on low level packages that require only testing confirmation to pass
- 1x a month: running our aggregated dependency update script for all low level packages that require only testing confirmation
  - `$ yarn build:deps`
- 1x a month: running updates on NPMs that require additional visual confirmation, this includes...
  - dependency-name: "@patternfly/*"

#### Process for updating NPMs
To update packages in bulk there are 2 pre-defined paths, "basic" and "core".

> It is **highly discouraged** that you rely on updating the `yarn.lock` file only. This creates long-term issues when NPM references in `package.json` potentially require specific
> dependencies, or have built around specific package functionality that could be inadvertently altered by updating a dependencies' dependency. Update `package.json` packages instead.
>
> To review where a NPM package resource parent in `package.json` is... within the repo context run `$ npm ls [package name]`. This can help provide you with a dependency tree of resources in `package.json` that should
> be updated.

##### Basic NPM updates

1. Clone the repository locally, or bring your fork up-to-date with the development branch. [Make sure development tooling is installed](#install-tooling).
1. Open a terminal instance in the repository context and run
    ```
    $ yarn build:deps
    ```
   This will cycle through ALL basic NPM dependencies, running both unit tests, build and local integration checks. If
   any errors are throw the package update is skipped.
1. After the updates have completed **YOU MUST VISUALLY CONFIRM** the updates were successful by running both local development start scripts.
   - Visually confirm that local development still functions and can be navigated with...
      1. Start VPN, and make sure Docker/Podman is running.
      1. Run
         ```
         $ yarn start
         ```
   - Visually confirm that staging development still functions and can be navigated with...
      1. Start VPN, and make sure Docker/Podman is running.
      1. Run
         ```
         $ yarn start:stage
         ```
1. After you've confirmed everything is functioning correctly, check and commit the related changes to `package.json` and `yarn.lock`, then open a pull request towards the development branch.
> If any part of the "basic path" process fails you'll need to figure out which NPM is the offender and remove it from the update. OR resolve to fix the issue
> since future updates will be affected by skipping any package update.
> A `dependency-update-log.txt" file is generated in the root of the repository after each run of `$ yarn build:deps` this should contain a listing of the skipped packages.

##### Core NPM updates
1. Clone the repository locally, or bring your fork up-to-date with the development branch. [Make sure development tooling is installed](#install-tooling).
1. Open a terminal instance in the repository context and run
    ```
    $ yarn build:deps-core
    ```
   This will cycle through ALL core NPM dependencies, running both unit tests, build and local integration checks. If
   any errors are throw the package update is skipped.
1. After the updates have completed **YOU MUST VISUALLY CONFIRM** the updates were successful by running both local development start scripts.
   - Visually confirm that local development still functions and can be navigated with...
      1. Start VPN, and make sure Docker/Podman is running.
      1. Run
         ```
         $ yarn start
         ```
  - Visually confirm that staging development still functions and can be navigated with...
     1. Start VPN, and make sure Docker/Podman is running.
     1. Run
        ```
        $ yarn start:stage
        ```
1. After you've confirmed everything is functioning correctly, check and commit the related changes to `package.json` and `yarn.lock`, then open a pull request towards the development branch.
> If any part of the "core path" process fails you'll need to figure out which NPM is the offender and remove it from the update. OR resolve to fix the issue
> since future updates will be affected by skipping potentially any package update.
> A `dependency-update-log.txt" file is generated in the root of the repository after each run of `$ yarn build:deps-core` this should contain a listing of the skipped packages.

##### Manual NPM updates
This is the slowest part of package updates. If any packages are skipped during the "basic" and "core" automation runs. Those packages will need to be updated manually.
1. Clone the repository locally, or bring your fork up-to-date, with the development branch. [Make sure development tooling is installed](#install-tooling).
1. Remove/delete the `node_modules` directory (there may be differences between branches that create package alterations)
1. Run
   ```
   $ yarn
   ```
   To re-install the baseline packages.
1. Start working your way down the list of `dependencies` and `devDependencies` in [`package.json`](./package.json). It is normal to start on the `dev-dependencies` since the related NPMs support build process. Build process updates, short of a semver major/minor, generally do not break the application.
   > Some text editors fill in the next available NPM package version when you go to modify the package version. If this isn't available you can always use [NPM directly](https://www.npmjs.com/)... start searching =).
1. After each package version update in [`package.json`](./package.json) you'll run the follow scripts
   - `$ yarn test`, if it fails you'll need to run `$ yarn test:dev` and update the related tests
   - `$ yarn build`, if it fails you'll need to run `$ yarn test:integration-dev` and update the related tests
   - Make sure Docker/Podman is running, then type `$ yarn start`. Confirm that staging run is still accessible and that no design alterations have happened. Fix accordingly.
   - Make sure Docker/Podman is running, then type `$ yarn start:stage`. Confirm that staging run is still accessible and that no design alterations have happened. Fix accordingly.
1. If the package is now working commit the change and move on to the next package.
   - If the package fails, or you want to skip the update, take the minimally easy path and remove/delete `node_modules` then rollback `yarn.lock` **BEFORE** you run the next package update.
> There are alternatives to resetting `node_modules`, we're providing the most direct path.
>
> Not updating a package is not the end-of-the-world. A package is not going to randomly break because you haven't updated to the latest version.

> Security warnings on NPM packages should be reviewed on a "per-alert basis" since **they generally do not make a distinction between build resources and what is within the applications compiled output**. Blindly following a security
> update recommendation is not always the optimal path.

</details>

<details>
<summary><h3 style="display: inline-block">Build maintenance</h3></summary>

- Webpack configuration. The build uses configuration combined with NPM scripts found in [`package.json`](./package.json).
  - Webpack build files
    - [`./config`](./config)
    - [`./scripts/post.sh`](./scripts/post.sh)
    - [`./scripts/pre.sh`](./scripts/pre.sh)
- GitHub Actions
  - Action files
    - [`./.github/workflows`](.github/workflows)
  - Related script files
    - [`./.scripts/actions.commit.js`](./scripts/actions.commit.js)
</details>

## Development
<details>
<summary><h3 style="display: inline-block">Install tooling</h3></summary>

Before developing you'll need to install:
* [NodeJS and NPM](https://nodejs.org/)
* [Docker](https://docs.docker.com/desktop/)
  * Alternatively, you can try [Podman](https://github.com/containers/podman). [Homebrew](https://brew.sh/) can be used for the install `$ brew install podman`
* And [Yarn](https://yarnpkg.com)

#### OS support
The tooling for Quipucords-UI is `Mac OS` centered.

While some aspects of the tooling have been expanded for Linux there may still be issues. It is encouraged that OS tooling
changes are contributed back while maintaining existing `Mac OS` functionality.

If you are unable to test additional OS support it is imperative that code reviews take place before integrating/merging build changes.

#### NodeJS and NPM
The Quipucords-UI build attempts to align to the current NodeJS LTS version. It is possible to test future versions of NodeJS LTS. See CI Testing for more detail.

#### Docker and Mac
Setting [Docker](https://docs.docker.com/desktop/) up on a Mac? Install the appropriate package. Confirm everything installed correctly by trying these steps.
1. In a terminal instance run
   ```
   $ docker run hello-world
   ```

Reference the Docker documentation for additional installation help.

#### Docker and Linux
Setting Docker up on a Linux machine may include additional steps.
* [Docker on Linux](https://docs.docker.com/desktop/install/linux-install/)

Reference the Docker documentation for additional installation help.

#### Yarn
Once you've installed NodeJS you can use NPM to perform the [Yarn](https://yarnpkg.com) install

  ```
  $ npm install yarn -g
  ``` 
</details>

<details>
<summary><h3 style="display: inline-block">dotenv file setup</h3></summary>

"dotenv" files contain shared configuration settings across the Quipucords-UI code and build structure. These settings are imported through [helpers](./src/common/helpers.js), or through other various `process.env.[dotenv parameter names]` within the code or build.

#### Setup basic dotenv files
Before you can start any local development you need to relax permissions associated with the platform. This
affects various aspects of both `local` and `stage` development.

1. Create a local dotenv file in the root of `Quipucords-UI` called `.env.local` and add the following contents
    ```
    REACT_APP_DEBUG_MIDDLEWARE=true
    ```

#### Advanced dotenv files
The dotenv files are structured to cascade each additional dotenv file settings from a root `.env` file.
```
 .env = base dotenv file settings
 .env.local = a gitignored file to allow local settings overrides
 .env -> .env.development = local run development settings that enhances the base .env settings file
 .env -> .env.staging = local run staging settings that enhances the base .env settings file
 .env -> .env.production = build modifications associated with all environments
 .env -> .env.production.local = a gitignored, dynamically generated build modifications associated with all environments
 .env -> .env.test = testing framework settings that enhances the base .env settings file
```

##### Current directly available _developer/debugging/test_ dotenv parameters

> Technically all dotenv parameters come across as strings when imported through `process.env`. It is important to cast them accordingly if "type" is required.


| dotenv parameter           | definition                                                                                 |
|----------------------------|--------------------------------------------------------------------------------------------|
| REACT_APP_AUTH_TOKEN       | A static string associated with overriding the assumed UI/application token name           |
| REACT_APP_DEBUG_MIDDLEWARE | A static boolean that activates the console state debugging messages associated with Redux |


##### Current directly available _build_ dotenv parameters

> Technically all dotenv parameters come across as strings when imported through `process.env`. It is important to cast them accordingly if "type" is required.

| dotenv parameter                                  | definition                                                                                   |
|---------------------------------------------------|----------------------------------------------------------------------------------------------|
| REACT_APP_UI_VERSION                              | A dynamic string reference to the build populated package.json version reference             |
| REACT_APP_UI_NAME                                 | A static string reference similar to the application name                                    |
| REACT_APP_UI_SHORT_NAME                           | A static string reference to a shortened display version of the application name             |
| REACT_APP_UI_SENTENCE_START_NAME                  | A static string reference to the "sentence start" application name                           |
| REACT_APP_UI_BRAND_NAME                           | A static string reference similar to the official application name                           |
| REACT_APP_UI_BRAND_SHORT_NAME                     | A static string reference to a shortened official display version of the application name    |
| REACT_APP_UI_BRAND_SENTENCE_START_NAME            | A static string reference to the official "sentence start" application name                  |
| REACT_APP_UI_BRAND                                | A dynamic boolean reference used in building the official brand version of Quipucords-UI     |
| REACT_APP_AUTH_TOKEN                              | A static string reference to the authentication token                                        |
| REACT_APP_AUTH_HEADER                             | A static string reference to the authentication header                                       |
| REACT_APP_AJAX_TIMEOUT                            | A static number reference to the milliseconds used to timeout API requests                   |
| REACT_APP_TOAST_NOTIFICATIONS_TIMEOUT             | A static number reference to the milliseconds used to hide toast notifications               |
| REACT_APP_POLL_INTERVAL                           | A static number reference to the milliseconds used in view polling                           |
| REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG      | A static string reference to the UI/application default locale language                      |
| REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG_DESC | A static string reference to the UI/application default locale language                      |              
| REACT_APP_CONFIG_SERVICE_LOCALES                  | A static string reference to a JSON resource for available UI/application locales            |                 
| REACT_APP_CONFIG_SERVICE_LOCALES_PATH             | A static string reference to the JSON resources for available UI/application locale strings  |            
| REACT_APP_CONFIG_SERVICE_LOCALES_EXPIRE           | A static number reference to the milliseconds the UI/application locale strings/files expire |                      
| REACT_APP_CREDENTIALS_SERVICE                     | A static string reference to the API spec                                                    |                                                 
| REACT_APP_FACTS_SERVICE                           | A static string reference to the API spec                                                    |                                                 
| REACT_APP_REPORTS_SERVICE                         | A static string reference to the API spec                                                    |                                                 
| REACT_APP_REPORTS_SERVICE_DETAILS                 | A static string reference to the API spec                                                    |                                                 
| REACT_APP_REPORTS_SERVICE_DEPLOYMENTS             | A static string reference to the API spec                                                    |                                                 
| REACT_APP_REPORTS_SERVICE_MERGE                   | A static string reference to the API spec                                                    |                                                 
| REACT_APP_SCANS_SERVICE                           | A static string reference to the API spec                                                    |                                                 
| REACT_APP_SCAN_JOBS_SERVICE_START_GET             | A static string reference to the API spec                                                    |                                                 
| REACT_APP_SCAN_JOBS_SERVICE                       | A static string reference to the API spec                                                    |                                                 
| REACT_APP_SCAN_JOBS_SERVICE_CONNECTION            | A static string reference to the API spec                                                    |                                                 
| REACT_APP_SCAN_JOBS_SERVICE_INSPECTION            | A static string reference to the API spec                                                    |                                                 
| REACT_APP_SCAN_JOBS_SERVICE_PAUSE                 | A static string reference to the API spec                                                    |                                                 
| REACT_APP_SCAN_JOBS_SERVICE_CANCEL                | A static string reference to the API spec                                                    |                                                 
| REACT_APP_SCAN_JOBS_SERVICE_RESTART               | A static string reference to the API spec                                                    |                                                 
| REACT_APP_SCAN_JOBS_SERVICE_MERGE                 | A static string reference to the API spec                                                    |                                                 
| REACT_APP_SOURCES_SERVICE                         | A static string reference to the API spec                                                    |                                                 
| REACT_APP_USER_SERVICE                            | A static string reference to the API spec                                                    |                                                 
| REACT_APP_USER_SERVICE_CURRENT                    | A static string reference to the API spec                                                    |                                                 
| REACT_APP_USER_SERVICE_LOGOUT                     | A static string reference to the API spec                                                    |                                                 
| REACT_APP_STATUS_SERVICE                          | A static string reference to the API spec                                                    |                                                 

</details>

<details>
<summary><h3 style="display: inline-block">Local and staging development</h3></summary>

#### Start writing code with local run
This is a local run designed to function with minimal resources and a mock API.

1. Confirm you've installed all recommended tooling
1. Confirm the repository name has no blank spaces in it. If it does replace that blank with a dash or underscore, Docker has issues with unescaped parameter strings.
1. Confirm you've installed resources through yarn
1. Create a local dotenv file called `.env.local` in the root of Quipucords-UI, and add the following contents
    ```
    REACT_APP_DEBUG_MIDDLEWARE=true
    ```
1. Make sure Docker/Podman is running
1. Open a couple of instances of Terminal and run...
   ```
   $ yarn start
   ```
   and, optionally,
   ```
   $ yarn test:dev
   ```
1. Make sure your browser opened around the domain `https://localhost:3000/`
1. Start developing...

#### Start writing code with staging
This is an authenticated local run that has the ability to run against a containerized API.

1. Confirm you've installed all recommended tooling
1. Confirm the repository name has no blank spaces in it. If it does replace that blank with a dash or underscore, Docker has issues with unescaped parameter strings.
1. Confirm you've installed resources through yarn
1. Create a local dotenv file called `.env.local` in the root of Quipucords-UI, and add the following contents
    ```
    REACT_APP_DEBUG_MIDDLEWARE=true
    ```
1. Make sure Docker/Podman is running
1. Open a couple of instances of Terminal and run...
    ```
    $ yarn start:stage
    ```
   and, optionally,
    ```
    $ yarn test:dev
    ```
1. Make sure you open your browser around the domain `https://localhost:5001/`
   > You may have to scroll, but the terminal output will have some available domains for you to pick from.
1. Log in. (You'll need mock credentials, reach out to the development team)
1. Start developing...

</details>


<details>
<summary><h3 style="display: inline-block">Reserved CSS classNames, and attributes</h3></summary>

#### Reserved testing attributes
This project makes use of reserved DOM attributes and string identifiers used by the testing team.
> Updating elements with these attributes, or settings, should be done with the knowledge "you are affecting" the testing team's ability to test.
> And it is recommended you coordinate with the testing team before altering these attributes, settings.

1. Attribute `data-test`
   - DOM attributes with `data-test=""` are used by the testing team as a means to identify specific DOM elements.
   - To use simply place `data-test="[your-id-coordinated-with-testing-team]`" onto a DOM element.

</details>

<details>
<summary><h3 style="display: inline-block">Directory and build structure</h3></summary>

This repository has interdependency on the [Quipucords responsitory](https://github.com/quipucords/quipucords).

#### Django templates, login and logout
In order to have GUI developer access to the login and logout aspects of [Quipucords](https://github.com/quipucords/quipucords) we store
the Django template files here [./templates/*](./templates/base.html).

> Important!
> - This templates directory is required as part of the build process. **Removing `./templates` directory will break the production build.**
> - Updating the templates requires minimal understand of html, plus some minor recognition of templating languages. [If needed checkout out the Django template structure reading](https://docs.djangoproject.com/en/2.1/topics/templates/).
> - We use a shell script token string replacement during the build process for the application display name. If you see **[UI_NAME]** within the templates, be aware.
> - [The build script for directly manipulating the templates is here, ./scripts/post.sh](./scripts/post.sh)

#### Brand build
The brand build updates aspects of the application name across the React and Django templates, think Quipucords versus Discovery.
To handle a branded aspect of the build, instead of `$ yarn build` run
   ```
   $ yarn build:brand
   ```
</details>

<details>
<summary><h3 style="display: inline-block">Debugging</h3></summary>

#### Debugging development
You can apply overrides during local development by adding a `.env.local` (dotenv) file in the repository root directory.

Once you have made the dotenv file and/or changes, like the below "debug" flags, restart the project and the flags should be active.

*Any changes you make to the `.env.local` file should be ignored with `.gitignore`.*

#### Debugging Redux
This project makes use of React & Redux. To enable Redux browser console logging add the following line to your `.env.local` file.
  ```
  REACT_APP_DEBUG_MIDDLEWARE=true
  ```
</details>

<details>
<summary><h3 style="display: inline-block">Testing</h3></summary>

> Blindly updating unit test snapshots is not recommended. Within this code-base snapshots have been created
> to specifically call out when updates happen. If a snapshot is updating, and it is unexpected, this is our first
> line of checks against bugs/issues.

#### Unit testing
To run the unit tests with a watch during development you'll need to open an additional terminal instance, then run
  ```
  $ yarn test:dev
  ```

##### Updating test snapshots
To update snapshots from the terminal run
  ```
  $ yarn test:dev
  ```

From there you'll be presented with a few choices, one of them is "update", you can then hit the "u" key. Once the update script has run you should see additional changed files within Git, make sure to commit them along with your changes or continuous integration testing will fail.

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

#### Integration-like testing
To run tests associated with checking build output run
   ```
   $ yarn build
   $ yarn test:integration
   ```

##### Updating integration-like test snapshots
To update snapshots from the terminal run
  ```
  $ yarn test:integration-dev
  ```
</details>
