##
This is the server for hermitly to connect various devices together.

When a user starts a session from the browser, a connected device gets a notification to join. This opens a websocket from the server.

Otherwise, the browser extension runs a websocket waiting to hear if a session has started on another device. 

Using the websocket, we can log the distractions of the user on each device.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```