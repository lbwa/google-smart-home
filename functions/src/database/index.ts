import * as admin from 'firebase-admin'

let serviceAccountKey
try {
  serviceAccountKey = require('../firebase-admin-sdk.json')
} catch (err) {
  console.warn(err)
  console.warn('Service account key is not found.')
  console.warn('Report state and Request sync will be unavailable.')
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  databaseURL: 'https://smart-home-88eea.firebaseio.com'
})

export const firebaseRef = admin.database().ref('/')

export async function update(
  deviceId: string,
  execution: string,
  payload: { [key: string]: any }
) {
  await firebaseRef
    .child(deviceId)
    .child(execution)
    .update(payload)
}
