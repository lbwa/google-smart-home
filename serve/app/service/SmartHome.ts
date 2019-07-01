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
  private readonly INTENT_MAP = {
    'action.devices.SYNC': this.onSync,
    'action.devices.QUERY': this.onQuery,
    'action.devices.EXECUTE': this.onExecute,
    'action.devices.DISCONNECT': this.onDisconnect
  }

  async dispatch({
    intent,
    payload,
    requestId
  }: {
    intent: string
    payload: any
    requestId: string
  }): Promise<SmartHomeResponse<any>> {
    if (this.INTENT_MAP[intent]) {
      return this.INTENT_MAP[intent].call(this, requestId, payload)
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
    { devices }: { devices: DeviceState[] }
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
  async onExecute(
    requestId: string,
    { commands }: SmartHomeExecutePayload
  ): Promise<SmartHomeResponse<SmartHomeExecuteResponse>> {
    const userId = await this.service.auth.getUserOrThrow()

    const responseCommands: SmartHomeExecuteResponse['commands'] = [
      {
        ids: [],
        status: 'SUCCESS',
        states: {} as { online: boolean }
      }
    ]

    for (let index = 0; index < commands.length; index++) {
      const { devices, execution } = commands[index]
      for (const { id: deviceId } of devices) {
        const states = await this.service.mongo.deviceExecution(
          userId,
          deviceId,
          // TODO: Support multiple executions in the same request
          execution[0]
        )
        responseCommands[index].ids.push(deviceId)
        responseCommands[index].states = states

        // Report state back to Google HomeGraph
        // (google-api-jwt is required)
        // await this.reportState({
        //   agentUserId: userId,
        //   requestId:
        //     deviceId +
        //     Date.now() +
        //     Math.random()
        //       .toString(16)
        //       .slice(2),
        //   payload: {
        //     devices: {
        //       states: {
        //         [deviceId]: states
        //       }
        //     }
        //   }
        // })
      }
    }

    return {
      requestId,
      payload: {
        commands: responseCommands
      }
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

interface SmartHomeExecutePayload {
  commands: {
    devices: {
      id: string
      customData?: {
        [extraData: string]: any
      }
    }[]
    execution: {
      command: string
      params: {
        [executionName: string]: string | number | boolean
      }
    }[]
  }[]
}

type SmartHomeExecuteStatus = 'SUCCESS' | 'PENDING' | 'OFFLINE' | 'ERROR'

interface SmartHomeExecuteResponse {
  commands: {
    ids: string[]
    status: SmartHomeExecuteStatus
    states?: {
      online: boolean
      [extraState: string]: string | number | boolean
    }
  }[]
}
