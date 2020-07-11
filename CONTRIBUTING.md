## Contributing to hubble.gl

**Thanks for taking the time to contribute!**

PRs and bug reports are welcome, and we are actively looking for new maintainers.

## Setting Up Dev Environment

The **master** branch is the active development branch.

Building Hubble.gl locally from the source requires node.js `>=10`.
We use [yarn](https://yarnpkg.com/en/docs/install) to manage the dependencies.

```bash
# 1. Clone your fork of the hubble.gl repository
git clone git git@github.com:<github username>/hubble.gl.git

# 2. Move to the directory where you put hubble.gl
cd hubble.gl

# 3. Add the main repository as an upstream remote
git remote add upstream "git@github.com:uber/hubble.gl.git"

# 4. Change to the master branch if not already on it (starts on master by default)
git checkout master

# 5. Installs JavaScript dependencies
yarn
yarn bootstrap

# 6. Tests to make sure install went smoothly
yarn test

# 7. Hubble.gl is intended for use with mapbox https://www.mapbox.com/
export MapboxAccessToken=<your_access_token_here>

# 8. Start up hubble.gl example project
# Optional: cd to a directory within the examples folder. If done, repeat steps 5 & 6
yarn start-local
```

If you consider opening a PR, here are some documentations to get you started:

- vis.gl [developer process](https://www.github.com/visgl/tsc/tree/master/developer-process)

### Maintainers

- [Chris Gervang](https://github.com/chrisgervang)

Maintainers of hubble.gl have commit access to this GitHub repository, and take part in the decision making process.

## Code of Conduct

Please be mindful of and adhere to the Contributor Covenant's [Code of Conduct](https://lfprojects.org/policies/code-of-conduct/) when contributing to Hubble.gl.
