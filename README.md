<!-- @format -->

![Uwazi Logo](https://www.uwazi.io/wp-content/uploads/2017/09/cropped-uwazi-color-logo-300x68.png)

[![devDependency Status](https://david-dm.org/huridocs/uwazidocs/dev-status.svg)](https://david-dm.org/huridocs/uwazi#info=devDependencies)
[![dependency Status](https://david-dm.org/huridocs/uwazidocs/status.svg)](https://david-dm.org/huridocs/uwazi#info=dependencies)
![Uwazi CI](https://github.com/huridocs/uwazi/workflows/Uwazi%20CI/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/8c98a251ca64daf434f2/maintainability)](https://codeclimate.com/github/huridocs/uwazi/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/8c98a251ca64daf434f2/test_coverage)](https://codeclimate.com/github/huridocs/uwazi/test_coverage)

Uwazi is an open-source document manager.

[Uwazi](https://www.uwazi.io/) | [HURIDOCS](https://huridocs.org/)

Read the [user guide](https://github.com/huridocs/uwazi/wiki)

# Intallation guide

- [Dependencies](#dependencies)
- [Production](#production)
- [Development](#development)

# Dependencies

Before anything else you will need to install the application dependencies:

- **NodeJs 14.6.x** For ease of update, use nvm: https://github.com/creationix/nvm.
- **ElasticSearch 7.6.2** https://www.elastic.co/guide/en/elasticsearch/reference/7.6/install-elasticsearch.html Please note that ElasticSearch requires java.  Follow the instructions to instal the package manually, and install v7.6.2.  v7.7.x and above are known to cause `HPE_HEADER_OVERFLOW` errors.  Please, ensure v7.6.2 only. You also probably need to disable ml module in the ElasticSearch config file:
  `xpack.ml.enabled: false`
- **MongoDB 4.2** https://docs.mongodb.com/v4.2/installation/ .  If you have a previous version installed, please follow instructions on how to [upgrade here](https://docs.mongodb.com/manual/release-notes/4.2-upgrade-standalone/).
- **Yarn** https://yarnpkg.com/en/docs/install.
- **pdftotext (Poppler)** tested to work on version 0.26 but its recommended to use the latest available for your platform https://poppler.freedesktop.org/. Make sure to **install libjpeg-dev** if you build from source.

and change some global settings:
```
$ npm config set scripts-prepend-node-path auto
```
# Production

Download the [latest stable](https://github.com/huridocs/uwazi/releases) code for production installs.

### Production Build
```
$ cd uwazi
$ yarn install
$ yarn production-build
```
This will create a self-contained "prod" folder in Uwazi's root directory containing everything you need to run Uwazi. There is no need to keep the rest of the files so you can go ahead and copy the production-ready code to its final destination with:
```
$ cp -r ./prod [destination folder]/uwazi
```
The first time you run Uwazi, you will need to initialize the database with its default blank values. Do not run this command for existing projects as it will erase the entire database. Note that from this point on you need ElasticSearch and MongoDB running.
```
$ cd [destination folder]/uwazi
$ yarn blank-state
```
Then start the server by typing:
```
$ yarn run-production
```
By default, Uwazi runs on localhost on the port 3000, so point your browser to http://localhost:3000 and authenticate yourself with the default username "admin" and password "change this password now".

It is advisable to create your own system service configuration. Check out the user guide for [more configuration options](https://github.com/huridocs/uwazi/wiki/Install-Uwazi-on-your-server).

### Upgrading Uwazi and data migrations

In order to update/upgrade your Uwazi installation you need to repeat the build steps and overwrite the application files while keeping the user files intact:

1. Download the [latest stable](https://github.com/huridocs/uwazi/releases).
2. Run the build with:
```
$ yarn install
$ yarn production-build
```
3. Shutdown Uwazi if it is currently running (you don't need to shutdown ElasticSearch, Mongo, etc).
4. Copy the following files and directories to the destination folder:
  - prod/app -> [destination folder]/app
  - prod/database -> [destination folder]/database
  - prod/node_modules -> [destination folder]/node_modules
  - prod/package.json -> [destination folder]/package.json
  - prod/run.js -> [destination folder]/run.js
  - prod/server.js -> [destination folder]/server.js
5. Update your existing database with:
```
yarn migrate
```
6. Reindex your ElasticSearch indexes with:
```
yarn reindex
```
7. Restart your service with systemctl or:
```
yarn run-production
```
A simpler approach for step 4 is to configure the user file paths to be placed outside of the "prod" folder and just overwrite the whole "prod" folder when upgrading. Check out the user guide for [more configuration options](https://github.com/huridocs/uwazi/wiki/Install-Uwazi-on-your-server).
# Development
If you want to use the latest development code:
```
$ git clone https://github.com/huridocs/uwazi.git
$ cd uwazi
$ yarn install
```
If you want to download the Uwazi repository and also download the included git submodules, such as the `uwazi-fixtures`, which is used for running the end-to-end testing:
```
$ git clone --recurse-submodules https://github.com/huridocs/uwazi.git
$ cd uwazi
$ yarn install
```
If the main Uwazi repository had already been cloned/downloaded and now you want to load its sub-modules, you can run
```
$ git submodule update --init
```
There may be an issue with pngquant not running correctly. If you encounter this issue, you are probably missing library **libpng-dev**. Please run:
```
$ sudo rm -rf node_modules
$ sudo apt-get install libpng-dev
$ yarn install
```
### Development Run
```
$ yarn hot
```
This will launch a webpack server and nodemon app server for hot reloading any changes you make.

### Testing

#### Unit and Integration tests

We test using the JEST framework (built on top of Jasmine). To run the unit and integration tests, execute
```
$ yarn test
```
This will run the entire test suite, both on server and client apps.

If the API tests timeout, the issue might be with mongodb-memory-server. See https://github.com/nodkz/mongodb-memory-server/issues/204. Memory server explicitly depends on a version of MongoDB that depends on libcurl3, but Debian 10 and other OS's come with libcurl4 installed instead.

To fix this, update node_modules/mongodb-memory-server-core/lib/util/MongoBinary.js#70.
Set `exports.LATEST_VERSION = '4.3.3'` or a similar new version.

#### End to End (e2e)

For End-to-End testing, we have a full set of fixtures that test the overall functionality. Be advised that, for the time being, these tests are run ON THE SAME DATABASE as the default database (uwazi_developmet), so running these tests will DELETE any exisisting data and replace it with the testing fixtures. DO NOT RUN ON PRODUCTION ENVIRONMENTS!

Running end to end tests require a running Uwazi app.

Running tests with Nightmare
```
$ yarn hot
```
On a different console tab, run
```
$ yarn e2e
```
Running tests with Puppeteer
```
$ DATABASE_NAME=uwazi_e2e INDEX_NAME=uwazi_e2e yarn hot
```
On a different console tab, run
```
$ yarn e2e-puppeteer
```
Note that if you already have an instance running, this will likely throw an error of ports already been used. Only one instance of Uwazi may be run in a the same port at the same time.

E2E Tests depend on electron. If something appears to not be working, please run `node_modules/electron/dist/electron --help` to check for problems.

### Default login

The application's default log in is admin / change this password now

Note the subtle nudge ;)

# Docker

https://github.com/fititnt/uwazi-docker is a project with a Docker containerized version of Uwazi.
