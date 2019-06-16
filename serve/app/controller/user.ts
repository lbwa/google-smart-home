import { Controller } from 'egg'

export default class UserController extends Controller {
  async createUser() {
    try {
      const { ctx } = this
      const {
        request: { body }
      } = ctx
      const {
        access_token: accessToken,
        refresh_token: refreshToken
      } = await this.service.mongo.createUser(body.username, body.password)
      ctx.body = {
        code: 200,
        accessToken,
        refreshToken
      }
    } catch (err) {
      console.error(err)
    }
  }
}
