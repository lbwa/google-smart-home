import * as functions from 'firebase-functions'
import { smarthome } from 'actions-on-google'

/**
 * DOC: https://github.com/actions-on-google/actions-on-google-nodejs/
 */
const app = smarthome({
  debug: true,
  key: '<api-key>'
})

/**
 * @description SYNC intents
 * DOC: https://developers.google.com/actions/smarthome/develop/process-intents#SYNC
 */
app.onSync((body, headers) => {
  // TODO Implement full SYNC response

  /**
   * @description SYNC response format:
   * https://developers.google.com/actions/smarthome/develop/process-intents#agentUserId
   */
  return {
    requestId: body.requestId, // Id of request for ease of tracing
    payload: {
      /**
       * @description agentUserId
       * Reﬂects the unique (and immutable) user ID on the agent's platform.
       * The string is opaque to Google, so if there's an immutable form vs a
       * mutable form on the agent side, use the immutable form (e.g. an
       * account number rather than email).
       */
      agentUserId: 'agent_user_id',
      devices: [
        /**
         * @description Wash guide
         * DOC: https://developers.google.com/actions/smarthome/guides/washer
         */
        {
          /**
           * @description id
           * the id of device in the partner's cloud, immutable and unique
           */
          id: 'washer',
          /**
           * @description type
           * The hardware type of device
           * All types:
           * https://developers.google.com/actions/smarthome/guides/
           *
           */
          type: 'action.devices.types.WASHER',
          /**
           * @description traits
           * List of traits this device supports, This deﬁnes the commands,
           * attributes, and states that the device has.
           */
          traits: [
            'action.devices.traits.OnOff',
            'action.devices.traits.StartStop',
            'action.devices.traits.RunCycle'
          ],
          name: {
            /**
             * Optional, List of names provided by the partner rather than the
             * user, often manufacturer names.
             */
            defaultNames: ['Washer sample'],
            // Required
            /**
             * Required. primary name of the device, generally provided by user.
             * This is also the name the Assistant will prefer to describe the
             * device in responses.
             */
            name: 'Washer',
            // Optional. Additional names provided by the user for the device.
            nicknames: ['Washer']
          },
          /**
           * @description willReportState
           *  Indicates whether this device will have its states updated by the
           * Real Time Feed.
           * true: real-time feed for reporting state
           * false: polling model
           */
          willReportState: false,
          deviceInfo: {
            manufacturer: 'Acme Co',
            model: 'acme-washer',
            hwVersion: '1.0', // hardware version
            swVersion: '1.0.1' // software version
          },
          attributes: {
            pauseable: true
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
