# Google Smart Home

This sample is used to describe how to build your own backend service associated with Google Home Control.

### Reference🔖

There are all [smart home references] including all data schema and `REST` API, `RPC` API, etc.

- [Google home official site]

[google home official site]: https://developers.google.com/actions/smarthome/concepts/
[smart home references]: https://developers.google.com/actions/smarthome/traits/

### Deployment

There are two kinds of deployment:

1. Deploy your backend services to `firebase functions` and `firebase real-time database`. You should download your `firebase-admin-sdk.json` to `functions/src/firebase-admin-sdk.json` before link to firebase real-time database.

   - `frontend` is a dashboard for firebase real-time database.
   - `functions` is firebase cloud functions directory.

     ```bash
     firebase login

     firebase deploy

     # all functionalities are deployed in the firebase from now on
     ```

2. Deploy your backend services to your own private services.

### Notice⚠️

You should follow these step to build this sample if you want that firebase works with a network proxy (More details: [firebase/issues/155]).

[firebase/issues/155]: https://github.com/firebase/firebase-tools/issues/155

1. mutate the source code of `faya-websocket` dependency (`firebase-tools` dependents on it).

   ```js
   var Client = function(_url, protocols, options) {
     options = options || {};
     // add this proxy setting
     options.proxy = {
         origin:  'http://localhost:' + LOCAL_NETWORK_PROXY_PORT,
     };
     …
   }
   ```

1. Export two variables

   ```sh
   # eg:
   # > export http_proxy=http://127.0.0.1:8000
   export http_proxy=<the http address of network proxy, including network port>

   # Optional step
   export NODE_TLS_REJECT_UNAUTHORIZED=0
   ```

1. `firebase login` without local server in your own `shell`

   ```sh
   firebase login --no-localhost
   ```
