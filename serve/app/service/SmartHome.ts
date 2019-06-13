import { Service } from 'egg'

export default class SmartHome extends Service {
  async dispatch({ type, payload, requestId }) {
    if (type === 'action.devices.SYNC') {
      return this.service.smartHome.onSync(requestId)
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

    return Promise.reject({
      code: 400,
      msg: 'Invalid action intent'
    })
  }

  public async onSync(requestId: string) {
    // todo
    return {
      requestId
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
}
