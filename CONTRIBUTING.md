# Contributing to Quipucords UI
Contributing to Quipucords UI encompasses repository specific requirements and the global [Quipucords contribution guidelines](https://github.com/quipucords/quipucords/blob/master/CONTRIBUTING.rst).


## Quipucords UI contributions
### Commits
In an effort to bring in future automation around we make use of [Conventional Commits](https://www.conventionalcommits.org).

It's encouraged that UI related commit messaging in Quipucords UI follow the format
```
   <type>[optional scope]: <issue number><description>
```


### Build Requirements
#### dotenv files
Our current build leverages `dotenv`, or `.env*`, files to apply environment build configuration. 

There are currently build processes in place that leverage the `.env*.local` files, these files are actively applied in our `.gitignore` in order to avoid build conflicts. They should continue to remain ignored, and not be added to the repository.

Specific uses:
- `env.local`, is used for development purposes typically around displaying Redux logging


### Testing Requirements
#### Code Coverage
The requirements for code coverage on Quipucords UI are currently maintained around `55%`, this will be increased in the future. 

Updates that drop coverage below the current threshold will need to have their coverage expanded accordingly before being merged. 

Settings for coverage can be found in [package.json](./package.json)
