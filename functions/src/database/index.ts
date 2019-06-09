import admin from '../admin'

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
