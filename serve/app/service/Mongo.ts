import { Service } from 'egg'

export default class Mongo extends Service {
  readonly ERR_CODE = {
    deviceNotFound: 'deviceNotFound'
  }

  public async createUser(
    username: string,
    password: string
  ): Promise<{
    access_token: string
    refresh_token: string
  }> {
    try {
      return await this.ctx.model.Users.create({
        username,
        password,
        access_token: `access_token_${Math.random()
          .toString(16)
          .slice(2)}`,
        refresh_token: `refresh_token_${Math.random()
          .toString(16)
          .slice(2)}`
      })
    } catch (err) {
      return Promise.reject(err)
    }
  }

  public async getUserId(accessToken: string): Promise<string> {
    try {
      const docs = await this.ctx.model.Users.find({
        access_token: accessToken
      })
      if (!docs.length) throw new Error(this.service.auth.ERROR_MAP.authFailure)

      return docs[0].id
    } catch (err) {
      return Promise.reject(err)
    }
  }

  public async getDevices(userId: string): Promise<DeviceState[]> {
    try {
      userId
      const docs = await this.ctx.model.Devices.find({
        id: userId
      })

      if (!docs.length) throw new Error(this.ERR_CODE.deviceNotFound)

      return docs.map(doc => ({
        id: doc.id,
        type: doc.type,
        traits: doc.traits,
        name: {
          defaultNames: doc.defaultNames,
          name: doc.name,
          nicknames: doc.nicknames
        },
        deviceInfo: {
          manufacturer: doc.manufacturer,
          model: doc.model,
          hwVersion: doc.hwVersion,
          swVersion: doc.swVersion
        },
        willReportState: doc.willReportState,
        attributes: doc.attributes
      }))
    } catch (err) {
      this.logger.error(err)
      return Promise.reject(err)
    }
  }

  public async queryDevices(userId: string, deviceId: string) {
    try {
      // TODO: 每一个 userId 都应对应一个 devices collection, 以 userId 为索引，
      // 当下所有的 devices 作为 collection 的值
      return {
        online: true,
        userId,
        deviceId
      }
    } catch (err) {
      this.logger.error(err)
      return Promise.reject(err.message || err)
    }
  }
}

interface BasicDeviceState {
  id: string
  type: string
  traits: string[]
  name: {
    defaultNames: string[]
    name: string
    nicknames: string[]
  }
  willReportState: boolean
}

/**
 * @description Used to SYNC intent
 */
export interface DeviceState extends BasicDeviceState {
  roomHint?: string
  deviceInfo?: {
    manufacturer: string
    model: string
    hwVersion: string
    swVersion: string
  }
  attributes?: {
    [key: string]: any
  }
  customData?: {
    [key: string]: any
  }
  [key: string]: any
}

/**
 * @description Used to QUERY intent
 */
export interface IsDeviceOnlineState {
  online: boolean
  [extraState: string]: any
}
