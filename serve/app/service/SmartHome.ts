import { Service } from 'egg'

export default class SmartHome extends Service {
  async dispatch({ type, payload, requestId }) {
    if (type === 'action.devices.SYNC') {
      return this.service.smartHome.onSync()
    }
    if (type === 'action.devices.QUERY') {
      return this.service.smartHome.onQuery(requestId, payload)
    }
    if (type === 'action.devices.EXECUTE') {
      return this.service.smartHome.onExecute(requestId, payload)
    }
    if (type === 'action.devices.DISCONNECT') {
      return this.service.smartHome.onDisconnect(requestId, payload)
    }

    return this.errorHandler('notSupported')
  }

  public async onSync() {
    try {
      const userId = await this.service.auth.getUserOrThrow()
      await this.service.firestore.setHomegraphEnabled(userId,true)
      const devices = await this.service.firestore.getDevices(userId)

      return {
        requestId: this.ctx.request.body.requestId,
        payload: {
          agentUserId: userId,
          devices
        }
      }
    } catch (err) {
      return this.errorHandler(err.message)
    }
  }

  public async onQuery(requestId: string, payload: any) {
    // todo
    return {
      requestId,
      payload
    }
  }

  public async onExecute(requestId: string, payload: any) {
    // todo
    return {
      requestId,
      payload
    }
  }

  public async onDisconnect(requestId: string, payload: any) {
    // todo
    return {
      requestId,
      payload
    }
  }

  public requestSync(agentUserId: string) {
    // todo
    console.log('agentUserId', agentUserId)
    return {
      code: 200
    }
  }

  public reportState(reportedState: any) {
    // todo
    console.log('reportedState :', reportedState)
    return {
      code: 200
    }
  }

  private errorHandler(msg: string) {
    return {
      requestId: this.ctx.request.body.requestId,
      payload: {
        errorCode: msg || 'unknownError'
      }
    }
  }
}
