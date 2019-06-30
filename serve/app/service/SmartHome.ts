import { Service } from 'egg'
import { DeviceState, IsDeviceOnlineState } from './Mongo'

/**
 * @description Google Smart Home Services
 * @SourceOfInspiration Inspired by actions-on-google-nodejs v2.8.0
 * https://github.com/actions-on-google/actions-on-google-nodejs/blob/v2.8.0/src/service/smarthome/smarthome.ts#L386-L443
 * @StackInActionsOnGoogle - How action -on-google-nodejs works
 * @step1 action trigger:
 * https://github.com/actions-on-google/actions-on-google-nodejs/blob/v2.8.0/src/assistant.ts#L95
 * @step2 pass payload to handler wrapper:
 * https://github.com/actions-on-google/actions-on-google-nodejs/blob/v2.8.0/src/assistant.ts#L72-L75
 * @step3 invoke actions handler wrapper:
 * https://github.com/actions-on-google/actions-on-google-nodejs/blob/v2.8.0/src/framework/express.ts#L46
 * @step4 invoke actions handler set by developer:
 * https://github.com/actions-on-google/actions-on-google-nodejs/blob/v2.8.0/src/service/smarthome/smarthome.ts#L440
 * @step5 set http response with status code, body:
 * https://github.com/actions-on-google/actions-on-google-nodejs/blob/v2.8.0/src/framework/express.ts#L47-L54
 */
export default class SmartHome extends Service {
  async dispatch({
    type,
    payload,
    requestId
  }: {
    type: string
    payload: any
    requestId: string
  }) {
    if (type === 'action.devices.SYNC') {
      return this.onSync()
    }
    if (type === 'action.devices.QUERY') {
      return this.onQuery(requestId, payload.devices)
    }
    if (type === 'action.devices.EXECUTE') {
      return this.onExecute(requestId, payload)
    }
    if (type === 'action.devices.DISCONNECT') {
      return this.onDisconnect(requestId, payload)
    }

    return this.errorHandler('notSupported')
  }

  /**
   * @description Handle action.devices.SYNC.
   * @doc https://developers.google.com/actions/smarthome/develop/process-intents#SYNC
   */
  async onSync(): Promise<SmartHomeResponse<SyncResponse>> {
    try {
      const userId = await this.service.auth.getUserOrThrow()
      const devices = await this.service.mongo.getDevices(userId)

      return {
        requestId: this.ctx.request.body.requestId as string,
        payload: {
          agentUserId: userId,
          devices
        }
      }
    } catch (err) {
      return this.errorHandler(err.message)
    }
  }

  /**
   * @description Handle action.devices.QUERY.
   * This intent queries for the current states of devices
   * It is used for queries where truly real-time accuracy is required
   * (for example, the status of a door lock).
   * @doc https://developers.google.com/actions/smarthome/develop/process-intents#QUERY
   */
  async onQuery(
    requestId: string,
    devices: DeviceState[]
  ): Promise<SmartHomeResponse<QueryResponse>> {
    try {
      const userId = await this.service.auth.getUserOrThrow()
      // Once a devices query failed, Query process occur a error
      const queries = await Promise.all(
        devices.map(device => this.service.mongo.queryDevice(userId, device.id))
      )

      if (!queries.length) throw new Error('Unsuccessful device queries !')

      const stateMap = queries.reduce(
        (stateMap, query) => {
          stateMap[query.id || 'no device id'] = query
          return stateMap
        },
        {} as QueryResponse['devices']
      )
      return {
        requestId,
        payload: {
          devices: stateMap
        }
      }
    } catch (err) {
      this.logger.error(err.message || (err as Error))
      return Promise.reject(err.message || (err as Error))
    }
  }

  /**
   * @description
   * @doc https://developers.google.com/actions/smarthome/develop/process-intents#EXECUTE
   */
  async onExecute(requestId: string, payload: any) {
    // todo
    return {
      requestId,
      payload
    }
  }

  /**
   * @description
   * @doc https://developers.google.com/actions/smarthome/develop/process-intents#DISCONNECT
   */
  async onDisconnect(requestId: string, payload: any) {
    // todo
    return {
      requestId,
      payload
    }
  }

  requestSync(agentUserId: string) {
    // todo
    console.log('agentUserId', agentUserId)
    return {
      code: 200
    }
  }

  reportState(reportedState: any) {
    // todo
    console.log('reportedState :', reportedState)
    return {
      code: 200
    }
  }

  private errorHandler(msg: string): SmartHomeResponse<SmartHomeErrorResponse> {
    return {
      requestId: this.ctx.request.body.requestId,
      payload: {
        errorCode: msg || 'unknownError'
      }
    }
  }
}

interface SmartHomeResponse<T> {
  requestId: string
  payload: T
}

interface SmartHomeErrorResponse {
  errorCode: string
  debugString?: string
}

type SyncResponse =
  | {
      agentUserId: string
      devices: DeviceState[]
    }
  | SmartHomeErrorResponse

interface QueryResponse {
  devices: {
    [deviceId: string]: IsDeviceOnlineState | SmartHomeErrorResponse
  }
}
