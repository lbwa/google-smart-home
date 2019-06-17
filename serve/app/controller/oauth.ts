import { Controller } from 'egg'
import assert = require('assert')

const REDIRECT_TO_GOOGLE = 'https://oauth-redirect.googleusercontent.com/r/'
const REDIRECT_URI_REG = new RegExp(REDIRECT_TO_GOOGLE)
const RESPONSE_TYPE = 'code'
// Sync with Google docs
const GRANT_TYPES = {
  code: 'authorization_code',
  refreshToken: 'refresh_token'
}
const SECONDS_TO_EXPIRATION = 60 * 60

/**
 * @description Two endpoints for OAuth 2.0
 * DOC: https://developers.google.com/actions/identity/oauth2?oauth=code#implement_oauth_account_linking
 */
export default class Oauth extends Controller {
  /**
   * @description Authorization code endpoint
   */
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

      // Google will send a GET request with a query string named state which
      // is used to identify what application to link to
      const redirectUri =
        query.redirect_uri +
        config.GOOGLE_PROJECT_ID +
        `?code=${authCode}` +
        `&state=${query.state}`

      // Redirect to google site to link user account to user's google account
      this.ctx.redirect(redirectUri)
    } catch (err) {
      this.logger.error(err)
      this.ctx.body = {
        code: 400,
        errCode: err.message || 'Invalid auth payload'
      }
      this.ctx.status = 400
    }
  }

  /**
   * @description Token exchange endpoint
   */
  async token() {
    try {
      const {
        request: {
          body: {
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: grantType,
            refresh_token: refreshToken,
            code
          }
        },
        app: { config }
      } = this.ctx

      assert.equal(clientId, config.OAUTH_CLIENT_ID, 'invalid client_id')
      assert.equal(
        clientSecret,
        config.OAUTH_CLIENT_SECRET,
        'invalid client_secret'
      )

      /**
       * @token_exchange_endpoint
       * @description exchange authorization code for access token and refresh
       * token
       */
      if (code) {
        assert.equal(
          code,
          await Promise.resolve('authorization code'),
          'invalid authorization code'
        )
        assert.equal(grantType, GRANT_TYPES.code, 'invalid grant_type')
        this.ctx.body = {
          token_type: 'Bearer',
          access_token: await Promise.resolve(`unique_access_token`),
          refresh_token: await Promise.resolve(`unique_refresh_token`),
          expires_in: SECONDS_TO_EXPIRATION
        }
        return
      }

      /**
       * @token_exchange_endpoint
       * @description exchange refresh token for access token
       */
      if (refreshToken) {
        assert.equal(grantType, GRANT_TYPES.refreshToken, 'invalid grant_type')
        assert.equal(
          refreshToken,
          await Promise.resolve('unique_refresh_token'),
          'invalid refresh token'
        )
        this.ctx.body = {
          token_type: 'Bearer',
          access_token: await Promise.resolve(`unique_access_token`),
          expires_in: SECONDS_TO_EXPIRATION
        }
        return
      }

      throw new Error('Expect a code or refresh_token')
    } catch (err) {
      this.logger.error(err)
      this.ctx.body = {
        code: 400,
        errCode: err.message || 'invalid auth payload'
      }
      this.ctx.status = 400
    }
  }
}