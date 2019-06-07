import * as functions from 'firebase-functions'
import { smarthome } from 'actions-on-google'

/**
 * DOC: https://github.com/actions-on-google/actions-on-google-nodejs/
 */
const app = smarthome({
  debug: true,
  key: '<api-key>'
})

app.onSync(body => {
  // TODO Implement full SYNC response
  return {
    requestId: body.requestId,
    payload: {
      agentUserId: 'agent_user_id',
      devices: [
        {
          id: 'washer',
          type: 'actions.devices.types.WASHER',
          traits: ['actions.devices.traits.OnOff'],
          willReportState: true,
          name: {
            defaultNames: ['Washer sample'],
            name: 'Washer',
            nicknames: ['Washer']
          },
          deviceInfo: {
            manufacturer: 'Acme Co',
            model: 'acme-washer',
            hwVersion: '1.0',
            swVersion: '1.0.1'
          }
        }
      ]
    }
  }
})

export const smartHome = functions.https.onRequest(app)

export const requestSync = functions.https.onRequest(
  async (request, response) => {
    try {
      /**
       * Sends a request to the home graph to send a new SYNC request.
       * This should be called when a device is added or removed for a given user id.
       */
      const res = await app.requestSync('agent_user_id')
      response.send({
        data: res
      })
    } catch (e) {
      console.error(e)
      response.status(500).send(`Error requesting sync ${e}`)
    }
  }
)

export const reportState = functions.database
  .ref('{deviceId}')
  .onWrite((change, context) => {
    console.log('Firebase write event triggered this cloud function')
  })
