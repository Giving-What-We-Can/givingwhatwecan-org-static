# Giving What We Can static

(Note: This repo is now deprecated and has been replaced by lyra)

A simple statically-generated site, implemented in [Metalsmith](http://www.metalsmith.io/).

Currently deprecated.

### Running locally

- Clone the repo
- `nvm use`
- `yarn install`
- Create a new `.env` file at the project root. (e.g. `touch .env && nano .env`)
- Add the following keys to `.env` (You'll need to contact the project admin privately for API keys):

```
ENV=development
CONTENTFUL_ACCESS_TOKEN=<contentful access token>
CONTENTFUL_SPACE=<contenful space>
GRAPHQL_ENDPOINT=<endpoint>
```

- Build the site using `yarn build` (run `yarn metalsmith` to only rebuild static while making adjustments during development)
- The site builds to the `./dest` directory --- the simplest way to serve this is to install [http-server](https://www.npmjs.com/package/http-server) globally (`yarn global add http-server`), open a new Terminal tab, `cd ./dest && http-server`. You can leave the server running between builds.

### Browserstack thank you

[Browserstack](https://www.browserstack.com/) has generously granted us an open source license for this project. We're an all mac dev shop and it's useful to test out on windows.
