import { Service } from 'egg'

export default class Auth extends Service {
  readonly ERROR_MAP = {
    authExpired: 'authExpired',
    authFailure: 'authFailure',
    unknownError: 'unknownError'
  }

  /**
   * @description Any google assistant requests will include an `access token`
   * with a `Authorization` request header.
   * @param header Koa Request header
   */
  private async getUser(accessToken) {
    try {
      return await Promise.resolve({ userId: accessToken })
    } catch (err) {
      throw new Error(this.ERROR_MAP.authExpired)
    }
  }

  public async getUserOrThrow() {
    try {
      const { authorization } = this.ctx.request.header
      const accessToken = (authorization as string).replace(/Bearer\s/, '')
      const { userId } = await this.getUser(accessToken)
      return userId
    } catch (err) {
      throw new Error(err || this.ERROR_MAP.authFailure)
    }
  }
}
