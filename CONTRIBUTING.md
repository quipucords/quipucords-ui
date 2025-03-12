# Contributing
Contributing encompasses repository specific requirements, and the global [Quipucords contribution guidelines](https://github.com/quipucords/quipucords/blob/main/CONTRIBUTING.md).

## Process
<details>
<summary><h3 style="display: inline-block">Using Git</h3></summary>

Quipucords-UI makes use of
- Both branch work inside the main repository and GitHub's fork and pull workflow
- A linear commit process and rebasing.

#### Branch syncing
Linear commit history for Quipucords-UI simplifies understanding and syncing changes across branches. Do not use merge commits. Always use fast-forward rebase.

New changes must be made in a branch and be submitted via GitHub pull requests. PRs should target merging to `main`.

</details>

<details>
<summary><h3 style="display: inline-block">Pull request workflow, and testing</h3></summary>

#### Setting up a pull request
When multiple developers are contributing features, development pull requests (PRs) should be opened against the `main` branch.

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
- If your pull request has more than a single commit it is recommended, for notes and tracking, you include the pull request number in your message using the below format. This additional copy is not counted towards the `65` character limit.
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
    - Can be a directory, filenames, or a generalized type
    - Does not have to encompass all file names affected
  - Issue number = the Jira issue number
    - Currently, the prefix `ds-[issue number]` can be used in place of `discovery-[issue number]`
  - Description = what the commit work encompasses. You can expand your description in the commit message body

  Example
  ```
  feat(scans): ds-123 activate foo against bar
  ```
> Not all commits need an issue number. But it is encouraged you attempt to associate
> a commit with an issue for tracking. In a scenario where no issue is available
> exceptions can be made for `fix`, `chore`, and `build`. But this is for tracking and
> can benefit followup development efforts.

#### Pull request test failures
Creating a pull request activates multiple checks through GitHub actions. [These actions can be located
here](./.github/workflows/)

> To resolve failures for any GitHub actions make sure you first review the results of the test by
> clicking the `checks` tab on the related pull request.
>
> Caching for GitHub actions and NPM packages is active. This caching allows subsequent pull request
> updates to avoid reinstalling npm dependencies.
>
> Occasionally test failures can occur after recent NPM package updates either in the pull request
> itself or in a prior commit to the pull request. The most common reason for this failure presents when
> a NPM package has changed its support for different versions of NodeJS.
>
> If test failures are happening shortly after a NPM package update you may need to clear the
> GitHub actions cache and restart the related tests.

##### Audit failures
Quipucords UI utilizes a unique script to highlight priority NPM audit alerts on production level packages. Below is a path based on past instances of this check failing.

The process for a security when the NPM package is maintained
1. Determine what the security alert is regarding.
   - It's a false positive OR legitimate... both processes are the same
      - There are times when facets of packages get an alert but the end compiled result doesn't actually get exposed in production. This can be ignored to a degree, but...
      - First, attempt to reset the `package-lock.json`. Doing this will auto-magically `patch` dependencies based on the use of `^`. Follow these steps
        1. simply deleting the lockfile
        1. using the correct version of NodeJS, look at the `engine` requirement in [`package.json`](./package.json) if you're unsure
        1. then running `$ npm install` again
        1. confirm the lockfile actually patched questionable `prod deps` by running `$ npm audit`.
           - if the audit check is still firing then there's no need to check/commit the lockfile back in, skip the last step
           - look for updated major and minor package updates with a fallback towards, making a contribution for the resource to help resolve your issue (just remember different teams different schedules), replacing the package, or copying/writing your own replacement (just because you copy it, that doesn't mean the security issue goes away)
        1. check/commit the updated lockfile back in 
      - Finally, as mentioned above you may need to consider alternatives if you were unable to resolve the audit. Alternatives include in no specific order or preference
         - You may consider relaxing the audit check
         - Making a contribution to the package
         - Finding an alternative package
         - Maintaining the code yourself


The process for a security when the NPM package is NOT maintained
1. Run through the exact same process as noted underneath the `maintained packages` list
2. Replace the package as soon as possible.
   - The patch process noted above will only work for so long until it doesn't
   - The package won't randomly break beyond the addition of the security audit
   - The team has an issue they need to resolve instead of waiting


</details>

<details>
<summary><h3 style="display: inline-block">Releasing code for all environments</h3></summary>

quipucords-ui uses GitHub releases, and our GitHub automation automatically builds and attaches artifacts to a release once its tag is created. See [integration.yml](https://github.com/quipucords/quipucords-ui/blob/main/.github/workflows/integration.yml) for implementation details and [Build workflow](https://github.com/quipucords/quipucords-ui/actions/workflows/integration.yml?query=event%3Apush) for the history of workflow runs.

#### Release artifacts

> [!WARNING]  
> Since the release of the "new" UI (1.11+), quipucords-ui, quipucords-installer and quipucords SHOULD be synced. The sync doesn't need to 
> match all the way down to patch level, though. Just matching down to minor (X.Y instead of X.Y.Z) is fine.

To create a new release, use `npm` to update version details, and open a PR to merge those changes to `main` using the following process.

1. Within the repo, confirm you're on a new branch from the latest `main` updates, and use `npm` to update the version:
   ```
   $ npm install                                # to ensure that packages are installed
   $ npm run release -- --dry-run               # to review the changes before committing them
   $ npm run release                            # to generate and commit the changes
   ```

   > If you disagree with automatic generated version number, you may override it with the > optional `--override` argument:
   > ```
   > $ npm run release -- --override X.X.X
   > ```
2. You still need to confirm you now have a release commit with the format `chore(release): X.X.X` that includes changes to:
   - [`package.json`](./package.json)
   - [`package-lock.json`](./package-lock.json)
   - [`CHANGELOG.md`](./CHANGELOG.md)

   If there are issues with the file updates, squash or amend any fixes into the single `chore(release): X.X.X` commit.
3. Then push the **SINGLE** commit and open a PR in GitHub for your branch to merge into `main`. Get necessary approvals, and merge.
   
   > The git hash for the linking inside CHANGELOG.md does NOT require the git hash of the release commit.
4. Using the [GitHub releases page](https://github.com/RedHatInsights/quipucords-ui/releases):
   1. Draft a new release from `main`, and confirm it references your latest `chore(release): X.X.X` commit hash.
   2. Create the new tag using the **SAME** semver version created by the release commit, i.e. `X.X.X`.

   > To avoid issues with inconsistent tags, please use the GitHub releases interface,
   > instead of manually creating release tags using `git`.

</details>

<details>
<summary><h3 style="display: inline-block">NPM maintenance</h3></summary>

#### Cycle for updating NPMs
Our schedule for updating NPMs
- dependabot running multiple times a month on minor and patch level packages that typically only require testing confirmation to pass
- dependabot running multiple times a month on major level packages that require an in-depth review

##### Manual NPM updates
> It is **highly discouraged** that you rely on updating ANY `lock` file ONLY recommendations. This creates long-term issues when NPM references in `package.json` potentially require specific
> dependencies, or have built around specific package functionality that could be inadvertently altered by updating a dependencies' dependency. `lock` file
> updates should only be leveraged under certain conditions.

This is the slowest part of package updates. If any packages are skipped during the "basic" and "core" automation runs. Those packages will need to be updated manually.
1. Clone the repository locally, or bring your fork up-to-date with the development branch. [Make sure development tooling is installed](#install-tooling).
1. Remove/delete the `node_modules` directory (there may be differences between branches that create package alterations)
1. Run
   ```
   $ npm install
   ```
   To re-install the baseline packages.
1. Start working your way down the list of `dependencies` and `devDependencies` in [`package.json`](./package.json). It is normal to start on the `dev-dependencies` since the related NPMs support build process updates at more consistent intervals without breaking the application.
   > Some text editors fill in the next available NPM package version when you go to modify the package version. If this isn't available you can always use [NPM directly](https://www.npmjs.com/)... start searching =).
1. After each package version update in [`package.json`](./package.json) you'll run the following scripts
  - `$ npm test`, if it fails you'll need to do one, two, or all of the following 
     - edit files for related linting and/or type errors 
     - run `$ npm run test:dev` and update the related unit tests
     - run `$ npm run test:integration-dev` and update the related tests
  - `$ npm start`, confirm that local run is still accessible and that no design alterations have happened. Fix accordingly.
1. If the package is now working commit the change and move on to the next package.
  - If the package fails, or you want to skip the update, take the minimally easy path and remove/delete `node_modules` then rollback `package-lock.json` **BEFORE** you run the next package update.
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
- Scripts for servers
   - [`apiDev.js`](./scripts/apiDev.js) - A Swagger/OpenAPI spec mock tool. Version limited. If a migration to the next OpenAPI spec is needed this tool needs to be updated, replaced, or removed
   - [`apiStage.js`](./scripts/apiStage.js) - A podman based local run
- GitHub Actions
  - Action files
    - [`./.github/workflows`](.github/workflows)
  - Related script files
    - [`./.scripts/actions.commit.js`](./scripts/actions.commit.js)

#### Webpack
The build utilizes a `Webpack` wrapper package called [`weldable`](https://www.npmjs.com/package/weldable). This package consolidates the package installs needed to compile output to save time and effort.

[`weldable`](https://www.npmjs.com/package/weldable) can be removed and replaced with the direct NPM packages if necessary.

##### Remove weldable
To remove
1. run the npm script `$ npm run build:eject`

This will output
- An updated `package.json`.
   - the `weldable` package reference in your `dependencies` will still need to be removed
   - A consolidated webpack configuration file. This may still need to be moved to the desired location.
   - And NPM script updates that reference the consolidated webpack configuration file. If the webpack file is moved these scripts will need to be updated.

If you change your mind, simply delete the updates and [`weldable`](https://www.npmjs.com/package/weldable) should remain in place.

> It's important to note that `weldable` is currently being used under "production" dependencies in `package.json`. If 
> `weldable` is removed you'll need to determine which packages need to be relocated from `dev-dependencies` to "production" level dependencies
</details>

## Development
<details>
<summary><h3 style="display: inline-block">Install tooling</h3></summary>

Before developing you'll need to install:
* [NodeJS and NPM](https://nodejs.org/)
  * Yarn install is now discouraged. There are dependency install issues with Yarn `1.x.x` versions.
* [podman desktop](https://podman-desktop.io/)

#### OS support
The tooling is `Mac OS` centered.

While some aspects of the tooling have been expanded for Linux there may still be issues. It is encouraged that OS tooling
changes are contributed back while maintaining existing `Mac OS` functionality.

If you are unable to test additional OS support it is imperative that code reviews take place before integrating/merging build changes.

#### NodeJS and NPM
The build attempts to align to the current NodeJS LTS version. It is possible to test future versions of NodeJS LTS. See CI Testing for more detail.

NPM is automatically packaged with your NodeJS install.
</details>

<details>
<summary><h3 style="display: inline-block">dotenv file setup</h3></summary>

"dotenv" files contain shared configuration settings across the Quipucords-UI code and build structure. These settings are imported through [helpers](./src/common/helpers.js), or through other various `process.env.[dotenv parameter names]` within the code or build.

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

##### Current directly available _build_ dotenv parameters

> Technically all dotenv parameters come across as strings when imported through `process.env`. It is important to cast them accordingly if "type" is required.

| dotenv parameter                                      | definition                                                                                                                |
|-------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| HTML_INDEX_DIR                                        | A relative path string reference used by the webpack build to reference where the HTML index file is located              |
| STATIC_DIR                                            | A relative path string reference used by the webpack build to reference where static resource files are located           |
| DIST_DIR                                              | A relative path string reference used by the webpack build to reference where webpack should place it's compiled output   |
| REACT_APP_UI_VERSION                                  | A dynamic string reference to the build populated package.json version reference                                          |
| REACT_APP_UI_NAME                                     | A static string reference similar to the application name                                                                 |
| REACT_APP_UI_SHORT_NAME                               | A static string reference to a shortened display version of the application name                                          |
| REACT_APP_UI_BRAND_NAME                               | A static string reference similar to the official application name                                                        |
| REACT_APP_UI_BRAND_SHORT_NAME                         | A static string reference to a shortened official display version of the application name                                 |
| REACT_APP_UI_BRAND                                    | A dynamic boolean reference used in building the official brand version of Quipucords-UI                                  |
| REACT_APP_TEMPLATE_UI_NAME                            | A dynamic string reference used in building the official brand version of Quipucords-UI. Applies the HTML title attribute |
| REACT_APP_AUTH_COOKIE                                 | A static string reference to the UI/application authentication cookie name                                                |
| REACT_APP_AUTH_COOKIE_EXPIRES                         | A static number reference to the UI/application authentication cookie expiration in day (24 hour) increments              |
| ~~REACT_APP_AJAX_TIMEOUT~~                            | A legacy parameter. A static number associated with the milliseconds ALL AJAX/XHR/Fetch calls timeout.                    |
| REACT_APP_POLL_INTERVAL                               | A static number reference to the milliseconds used in view polling                                                        |
| REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG          | A static string reference to the UI/application default locale language                                                   |
| ~~REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG_DESC~~ | A legacy parameter. A static string reference to the UI/application default locale language                               |
| REACT_APP_CONFIG_SERVICE_LOCALES                      | A static string reference to a JSON resource for available UI/application locales                                         |
| REACT_APP_CONFIG_SERVICE_LOCALES_PATH                 | A static string reference to the JSON resources for available UI/application locale strings                               |
| ~~REACT_APP_CONFIG_SERVICE_LOCALES_EXPIRE~~           | A legacy parameter. A static number reference to the milliseconds the UI/application locale strings/files expire          |
| REACT_APP_CREDENTIALS_SERVICE                         | A static string reference to the API spec                                                                                 |
| REACT_APP_CREDENTIALS_SERVICE_BULK_DELETE             | A static string reference to the API spec                                                                                 |
| REACT_APP_FACTS_SERVICE                               | A static string reference to the API spec                                                                                 |
| REACT_APP_REPORTS_SERVICE                             | A static string reference to the API spec                                                                                 |
| ~~REACT_APP_REPORTS_SERVICE_DETAILS~~                 | A legacy parameter. A static string reference to the API spec                                                             |
| ~~REACT_APP_REPORTS_SERVICE_DEPLOYMENTS~~             | A legacy parameter. A static string reference to the API spec                                                             |
| ~~REACT_APP_REPORTS_SERVICE_MERGE~~                   | A legacy parameter. A static string reference to the API spec                                                             |
| REACT_APP_SCANS_SERVICE                               | A static string reference to the API spec                                                                                 |
| REACT_APP_SCANS_SERVICE_BULK_DELETE                   | A static string reference to the API spec                                                                                 |
| ~~REACT_APP_SCAN_JOBS_SERVICE_START_GET~~             | A legacy parameter. A static string reference to the API spec                                                             |
| REACT_APP_SCAN_JOBS_SERVICE                           | A static string reference to the API spec                                                                                 |
| ~~REACT_APP_SCAN_JOBS_SERVICE_CONNECTION~~            | A legacy parameter. A static string reference to the API spec                                                             |
| ~~REACT_APP_SCAN_JOBS_SERVICE_INSPECTION~~            | A legacy parameter. A static string reference to the API spec                                                             |
| ~~REACT_APP_SCAN_JOBS_SERVICE_CANCEL~~                | A legacy parameter. A static string reference to the API spec                                                             |
| ~~REACT_APP_SCAN_JOBS_SERVICE_MERGE~~                 | A legacy parameter. A static string reference to the API spec                                                             |
| REACT_APP_SOURCES_SERVICE                             | A static string reference to the API spec                                                                                 |
| REACT_APP_SOURCES_SERVICE_BULK_DELETE                 | A static string reference to the API spec                                                                                 |
| REACT_APP_USER_SERVICE_AUTH_TOKEN                     | A static string reference to the API spec                                                                                 |
| REACT_APP_USER_SERVICE_CURRENT                        | A static string reference to the API spec                                                                                 |
| REACT_APP_USER_SERVICE_LOGOUT                         | A static string reference to the API spec                                                                                 |
| REACT_APP_STATUS_SERVICE                              | A static string reference to the API spec                                                                                 |

#### Updating non-npm dependencies

Since the migration to [konflux](https://konflux-ci.dev/docs/) as our downstream build system, base images in
our Containerfile MUST have the sha256 digest explicitly set. As part of the routine to update dependencies,
those digests must be updated as well.

In general, Renovate/Minkmaker automatic PRs should be able to keep the base images on the Containerfile in sync.
However, if a manual bump is required, there's a make target that shall take care of it. Just run

`make lock-baseimages`

This command has `podman`, `skopeo` and GNU `sed` as dependencies.

</details>

<details>
<summary><h3 style="display: inline-block">Local and staging development</h3></summary>

#### Start writing code with local run
This is a local run designed to function with minimal resources and a mock API.

> There may be limitations to running this emulated API. Check with the team to understand any current limitations.

1. Confirm you've installed all recommended tooling
1. Confirm the repository name has no blank spaces in it. If it does replace that blank with a dash or underscore, the container tooling may have issues with unescaped parameter strings.
1. Confirm you've installed resources through npm
1. Open a couple of instances of Terminal and run...
   ```
   $ npm start
   ```
   and, optionally,
   ```
   $ npm run test:dev
   ```
1. Make sure your browser opened around the domain `https://localhost:3000/`
1. Start developing...

#### Start writing code with staging
This is an authenticated local run that has the ability to run against a containerized API.

> There may be limitations to running this emulated API. Check with the team to understand any current limitations.

1. Confirm you've installed all recommended tooling
1. Confirm the repository name has no blank spaces in it. If it does replace that blank with a dash or underscore, the container tooling may have issues with unescaped parameter strings.
1. Confirm you've installed resources through npm
1. Make sure podman desktop is running
1. Open a couple of instances of Terminal and run...
    ```
    $ npm run start:stage
    ```
   and, optionally,
    ```
    $ npm run test:dev
    ```
1. Make sure you open your browser around the domain `https://localhost:3000/`. Loading can take up to and beyond a minute to download necessary resources.
   > You may have to scroll, but the terminal output will have some available domains for you to pick from.
1. Log in. (You'll need mock credentials, reach out to the development team if you're unsure)
1. Start developing...

</details>


<details>
<summary><h3 style="display: inline-block">Reserved CSS classNames, and attributes</h3></summary>

#### Reserved testing attributes
This project makes use of reserved DOM attributes and string identifiers used by the testing team.
> Updating elements with these attributes, or settings, should be done with the knowledge "you are affecting" the testing team's ability to test.
> And it is recommended you coordinate with the testing team before altering these attributes, settings.

1. Attribute `data-ouia-component-id`, or `ouiaId` attributes
   - this is the preferred way of identifying elements for the testing team
   - Most of the time, React prop is `ouiaId`. Some PatternFly elements don't support it, in which case you can use standard DOM prop `data-ouia-component-id`, `name` or `id`, or consult with the testing team for the preferred alternative.
   - Use `ouiaId` even if it seems to duplicate value of `name` or another attribute.
   - See [PatternFly documentation on OUIA](https://www.patternfly.org/developer-resources/open-ui-automation/).

</details>

<details>
<summary><h3 style="display: inline-block">Directory and build structure</h3></summary>

This repository has interdependency on the [Quipucords repository](https://github.com/quipucords/quipucords).

#### Brand build
The brand build updates aspects of the application name across the React components and views, think Quipucords versus Discovery.
To handle a branded aspect of the build, instead of `$ npm run build` run
   ```
   $ npm run build:brand
   ```
</details>

<details>
<summary><h3 style="display: inline-block">Debugging</h3></summary>

#### Debugging development
You can apply overrides during local development by adding a `.env.local` (dotenv) file in the repository root directory.

Once you have made the dotenv file and/or changes, like the below "debug" flags, restart the project and the flags should be active.

*Any changes you make to the `.env.local` file should be ignored with `.gitignore`.*

#### Unit testing
To run the unit tests with a watch during development you'll need to open an additional terminal instance, then run
  ```
  $ npm run test:dev
  ```

##### Updating test snapshots
To update snapshots from the terminal run
  ```
  $ npm run test:dev
  ```

From there you'll be presented with a few choices, one of them is "update", you can then hit the "u" key. Once the update script has run you should see additional changed files within Git, make sure to commit them along with your changes or continuous integration testing will fail.

##### Checking code coverage
To check the coverage report from the terminal run
  ```
  $ npm run test
  ```

##### Code coverage failing to update?
If you're having trouble getting an accurate code coverage report, or it's failing to provide updated results (i.e. you renamed files) you can try running
  ```
  $ npm run test:clearCache
  ```

#### Integration-like testing
To run tests associated with checking build output run
   ```
   $ npm run build
   $ npm run test:integration
   ```

##### Updating integration-like test snapshots
To update snapshots from the terminal run
  ```
  $ npm run test:integration-dev
  ```
</details>
