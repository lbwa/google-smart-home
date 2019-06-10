import * as functions from 'firebase-functions'
import {
  smarthome,
  SmartHomeV1ExecuteResponseCommands
} from 'actions-on-google'
import { firebaseRef } from '../database'
import { ApiClientObjectMap } from 'actions-on-google/dist/common'

/**
 * @description Smart home all reference including properties and Request API
 * https://developers.google.com/actions/smarthome/traits/
 */

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
 * REFER: https://developers.google.com/actions/smarthome/reference/rest/v1/devices/sync
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
            'action.devices.traits.RunCycle',
            'action.devices.traits.Modes'
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
            pauseable: true,
            /**
             * @description Each mode has a name and at least 2 settings.
             * DOC: https://developers.google.com/actions/smarthome/traits/modes#request
             */
            availableModes: [
              {
                // Internal name, which will be used in commands and states.
                name: 'load',
                name_values: [
                  {
                    name_synonym: ['load'],
                    lang: 'en'
                  }
                ],
                settings: [
                  {
                    setting_name: 'small',
                    setting_values: [
                      {
                        setting_synonym: ['small'],
                        lang: 'en'
                      }
                    ]
                  },
                  {
                    setting_name: 'large',
                    setting_values: [
                      {
                        setting_synonym: ['large'],
                        lang: 'en'
                      }
                    ]
                  }
                ],
                ordered: true
              }
            ]
          }
        }
      ]
    }
  }
})

/**
 * @description The intend is triggered to provided commands to execute on
 * smart home device
 *
 * DOC: https://developers.google.com/actions/smarthome/develop/process-intents#EXECUTE
 */

app.onExecute(({ requestId, inputs }, headers) => {
  const responsePayload: { commands: SmartHomeV1ExecuteResponseCommands[] } = {
    commands: [
      {
        ids: [''],
        status: 'SUCCESS',
        states: {
          online: true,
          on: false,
          isRunning: false,
          isPaused: false
        }
      }
    ]
  }
  Object.values(inputs).forEach(({ payload: { commands } }) => {
    commands.forEach(({ devices, execution }) => {
      responsePayload.commands[0].ids = devices.map(({ id: deviceId }) => {
        execution.forEach(({ command, params }) => {
          switch (command) {
            case 'action.devices.commands.OnOff':
              ;(responsePayload.commands[0].states as ApiClientObjectMap<
                any
              >).on = params.on
              return firebaseRef
                .child(deviceId)
                .child('OnOff')
                .update({
                  on: params.on
                })

            case 'action.devices.commands.StartStop':
              ;(responsePayload.commands[0].states as ApiClientObjectMap<
                any
              >).isRunning = params.start
              return firebaseRef
                .child(deviceId)
                .child('StartStop')
                .update({
                  isRunning: params.start
                })

            case 'action.devices.commands.PauseUnpause':
              ;(responsePayload.commands[0].states as ApiClientObjectMap<
                any
              >).isPaused = params.pause
              return firebaseRef
                .child(deviceId)
                .child('StartStop')
                .update({
                  isPaused: params.pause
                })

            case 'action.devices.commands.SetModes':
              return firebaseRef
                .child(deviceId)
                .child('Modes')
                .update({
                  load: params.updateModeSettings.load
                })
            default:
              return
          }
        })

        return deviceId
      })
    })
  })
  return {
    requestId,
    payload: responsePayload
  }
})

const queryFirebase = async (deviceId: string) => {
  const snapshot = await firebaseRef.child(deviceId).once('value')
  const snapshotVal = snapshot.val()
  return {
    on: snapshotVal.OnOff.on,
    isPaused: snapshotVal.StartStop.isPaused,
    isRunning: snapshotVal.StartStop.isRunning,
    load: snapshotVal.Modes.load
  }
}
const queryDevice = async (deviceId: string) => {
  const data = await queryFirebase(deviceId)
  return {
    on: data.on,
    isPaused: data.isPaused,
    isRunning: data.isRunning,
    /**
     * @description Device RunCycle states
     *https://developers.google.com/actions/smarthome/traits/runcycle#device-states
     */
    currentRunCycle: [
      {
        currentCycle: 'rinse',
        nextCycle: 'spin',
        lang: 'en'
      }
    ],
    currentTotalRemainingTime: 1212,
    currentCycleRemainingTime: 301,
    currentModeSettings: {
      load: data.load
    }
  }
}

app.onQuery(async ({ requestId, inputs }) => {
  const devices: { [key: string]: any } = {}
  const queryPromises: any[] = []
  inputs.forEach(({ payload: { devices: payloadDevices } }) => {
    payloadDevices.forEach(({ id: deviceId }) => {
      queryPromises.push(
        queryDevice(deviceId).then((data: any) => (devices[deviceId] = data))
      )
    })
  })

  await Promise.all(queryPromises)
  return {
    requestId,
    payload: {
      devices
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
