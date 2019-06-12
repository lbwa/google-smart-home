# Services for Google Home Actions

A fulfillment to handle Google Home intents and return response following the response formats of Google Smart Home(homegraph)

### Target

We must implement request handlers for 4 kinds of action intents.

- [action.devices.SYNC]
- [action.devices.QUERY]
- [action.devices.EXECUTE]
- [action.devices.DISCONNECT]

[action.devices.sync]: https://developers.google.com/actions/smarthome/develop/process-intents#SYNC
[action.devices.query]: https://developers.google.com/actions/smarthome/develop/process-intents#QUERY
[action.devices.execute]: https://developers.google.com/actions/smarthome/develop/process-intents#EXECUTE
[action.devices.disconnect]: https://developers.google.com/actions/smarthome/develop/process-intents#DISCONNECT

### Development

```bash
$ npm i
$ npm run dev
```

Don't tsc compile at development mode, if you had run `tsc` then you need to `npm run clean` before `npm run dev`.

### Deploy

```bash
$ npm run tsc
$ npm start
```

### Npm Scripts

- Use `npm run lint` to check code style
- Use `npm test` to run unit test
- se `npm run clean` to clean compiled js at development mode once

### Requirement

- Node.js 8.x
- Typescript 2.8+
