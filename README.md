# Google Smart Home

> This sample is used to describe how to build your own backend service associated with Google Home Control.

## 🔖Reference

There are all [smart home references] including all data schema and `REST` API, `RPC` API, etc.

[smart home references]: https://developers.google.com/actions/smarthome/traits/

## ⚠️Notice

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
