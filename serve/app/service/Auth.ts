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
  private async getUser() {
    try {
      const { authorization } = this.ctx.request.header
      const accessToken = (authorization as string).replace(/Bearer\s/, '')

      return await this.service.mongo.getUserId(accessToken)
    } catch (err) {
      return Promise.reject(err || this.ERROR_MAP.authExpired)
    }
  }

  public async getUserOrThrow() {
    try {
      const userId = await this.getUser()

      if (!userId) {
        throw new Error(
          `User ${userId} has not created an account, so there are no devices`
        )
      }
      return userId
    } catch (err) {
      this.logger.error(err)
      return Promise.reject(err.message || this.ERROR_MAP.authFailure)
    }
  }
}
