[![Build Status](https://travis-ci.org/patoi/aikido-irimi.svg?branch=master)](https://travis-ci.org/patoi/aikido-irimi)
# aikido-irimi
Aikido 2015 Summer Camp - registration application

## Features

- i18n
- ticket booking
- room booking, counting free spaces
- T-shirt selection
- menu selection
- price calculation
- handling registration dead line
- email sending (by AWS SES)
- downloading database in CSV

## Technology
It is running on AWS, NodeJS. Using: express, morgan, nedb and winston.
CI infrastucture running on TravisCI, with unit and e2e tests: chai, karma, nightwatch.
It's using materialize design and angularjs on client side 

## How to test or run

All script can be run from package.json, e.g.: npm run start-dev

- "test": "./_mocha && ./karma start --single-run"
- "livereload": "NODE_ENV=dev node livereload.js"
- "test-client": "./karma start --single-run"
- "coverage": "./node_modules/istanbul/lib/cli.js cover ./_mocha -- -R spec"
- "start-dev": "NODE_ENV=dev nodemon server.js"
- "start-staging": "NODE_ENV=staging forever start -c node server.js"
- "start-prod": "NODE_ENV=prod forever start -c node server.js"
