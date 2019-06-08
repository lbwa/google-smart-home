# Google Smart Home

> This sample is used to describe how to build your own backend service associated with Google Home

## Notice

You should follow this step to build this sample if you want to work with firebase and a network proxy (More details: [firebase/issues/155]).

[firebase/issues/155]: https://github.com/firebase/firebase-tools/issues/155

1. mutate your `faya-websocket` dependency (dependant by `firebase-tools`) config.

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
   export http_proxy=http://localhost:<Local network proxy port>
   export NODE_TLS_REJECT_UNAUTHORIZED=0
   ```

1. input `firebase login` in your own `shell`

   ```sh
   firebase login --no-localhost
   ```
