import { Service } from 'egg'

export default class SmartHomeService extends Service {
  public async dispatch({ type, payload, requestId }) {
    if (type === 'action.devices.SYNC') {
      return this.service.SmartHome.onSync(requestId)
    }
    if (type === 'action.devices.QUERY') {
      return this.service.SmartHome.onQuery(requestId, payload)
    }
    if (type === 'action.devices.EXECUTE') {
      return this.service.SmartHome.onExecute(requestId, payload)
    }
    if (type === 'action.devices.DISCONNECT') {
      return this.service.SmartHome.onDisconnect(requestId, payload)
    }
  }

  public async onSync(requestId: string) {
    // todo
  }

  public async onQuery(requestId: string, payload: any) {
    // todo
  }

  public async onExecute(requestId: string, payload: any) {
    // todo
  }

  public async onDisconnect(requestId: string, payload: any) {
    // todo
  }

  public requestSync(agentUserId: string) {
    // todo
  }

  public reportState(reportedState: any) {
    // todo
  }
}
