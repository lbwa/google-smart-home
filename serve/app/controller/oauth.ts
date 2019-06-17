import { Controller } from 'egg'
import assert = require('assert')

const REDIRECT_TO_GOOGLE = 'https://oauth-redirect.googleusercontent.com/r/'
const REDIRECT_URI_REG = new RegExp(REDIRECT_TO_GOOGLE)
const RESPONSE_TYPE = 'code'

export default class Oauth extends Controller {
  async authCode() {
    const {
      ctx: { query },
      app: { config }
    } = this
    try {
      assert.equal(query.client_id, config.OAUTH_CLIENT_ID, 'invalid client_id')
      assert.equal(
        query.client_secret,
        config.OAUTH_CLIENT_SECRET,
        'invalid client_secret'
      )
      assert.ok(
        REDIRECT_URI_REG.test(query.redirect_uri),
        'invalid redirect_uri'
      )
      assert.equal(
        query.response_type,
        RESPONSE_TYPE,
        'Only support Authorization code flow, rather than implicit code flow.'
      )

      const authCode = await Promise.resolve('authorization code')
      const redirectUri =
        query.redirect_uri +
        config.GOOGLE_PROJECT_ID +
        `?code=${authCode}` +
        `&state=${query.state}`

      this.ctx.redirect(redirectUri)
    } catch (err) {
      console.error(err)
      this.ctx.body = {
        code: 400,
        errCode: err.message || 'Invalid auth payload'
      }
      this.ctx.status = 400
    }
  }

  async token() {}
}
