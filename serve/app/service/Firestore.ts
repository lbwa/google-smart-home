import * as admin from 'firebase-admin'
import { SmartHomeV1SyncDevices } from 'actions-on-google'
import { Service } from 'egg'

let serviceAccountKey, googleProjectId
try {
  serviceAccountKey = require('../../config/firebase-admin-sdk.json')
  googleProjectId = require('../../config/index.json').google_project_id
} catch (err) {
  console.error('Service account key is not found.')
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  databaseURL: `https://${googleProjectId}.firebaseio.com`
})
const db = admin.firestore()
db.settings({
  timestampsInSnapshots: true
})

export default class Firestore extends Service {
  public async userExists(userId: string): Promise<boolean> {
    const userDoc = await db
      .collection('users')
      .doc(userId)
      .get()
    return userDoc.exists
  }

  public async getUserId(accessToken: string): Promise<string> {
    const querySnapshot = await db
      .collection('users')
      .where('access_token', '==', accessToken)
      .get()
    if (querySnapshot.empty) {
      throw new Error('No user found for this access token')
    }
    const doc = querySnapshot.docs[0]
    return doc.id // This is the user id in Firestore
  }

  public async homegraphEnabled(userId: string) {
    const userDoc = await db
      .collection('users')
      .doc(userId)
      .get()
    return userDoc.data()!!.homegraph
  }

  public async setHomegraphEnabled(userId: string, enabled: boolean) {
    await db
      .collection('users')
      .doc(userId)
      .update({
        homegraph: enabled
      })
  }

  public async getDevices(userId: string): Promise<SmartHomeV1SyncDevices[]> {
    const devices: SmartHomeV1SyncDevices[] = []
    const querySnapshot = await db
      .collection('users')
      .doc(userId)
      .collection('devices')
      .get()

    querySnapshot.forEach(doc => {
      const data = doc.data()
      devices.push({
        id: data.id,
        type: data.type,
        traits: data.traits,
        name: {
          defaultNames: data.defaultNames,
          name: data.name,
          nicknames: data.nicknames
        },
        deviceInfo: {
          manufacturer: data.manufacturer,
          model: data.model,
          hwVersion: data.hwVersion,
          swVersion: data.swVersion
        },
        willReportState: data.willReportState,
        attributes: data.attributes
      })
    })
    return devices
  }
}
