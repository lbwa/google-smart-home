import * as admin from 'firebase-admin'

let serviceAccountKey, projectId
try {
  serviceAccountKey = require('../firebase-admin-sdk.json')
  projectId = require('../config.json').project_id
} catch (err) {
  console.warn(err)
  console.warn('Service account key or config file is not found.')
  console.warn('Report state and Request sync will be unavailable.')
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  databaseURL: `https://${projectId}.firebaseio.com`
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
