import { Controller } from 'egg'
import assert = require('assert')

const REDIRECT_TO_GOOGLE = 'https://oauth-redirect.googleusercontent.com/r/'
const REDIRECT_URI_REG = new RegExp(REDIRECT_TO_GOOGLE)
const RESPONSE_TYPE = 'code'
const GRANT_TYPES = {
  code: 'authorization_code' /* Sync with Google docs */,
  refreshToken: 'refresh_token' /* Sync with Google docs */
}
const SECONDS_TO_EXPIRATION = 60 * 60

// These variables with session should be stored by database
const SAMPLE_AUTHORIZATION_CODE = 'authorization_code'
const SAMPLE_ACCESS_TOKEN = 'unique_access_token'
const SAMPLE_REFRESH_TOKEN = 'unique_refresh_token'

/**
 * @description Two endpoints for OAuth 2.0
 * DOC: https://developers.google.com/actions/identity/oauth2?oauth=code#implement_your_oauth_server
 */
export default class Oauth extends Controller {
  /**
   * @description Authorization code endpoint
   * Authorization endpoint parameters doesn't include client_secret
   */
  async authCode() {
    const {
      ctx: {
        query: {
          client_id: clientId,
          redirect_uri: redirectUri,
          response_type: responseType,
          state
        }
      },
      app: { config }
    } = this
    try {
      assert.strictEqual(clientId, config.OAUTH_CLIENT_ID, 'invalid client_id')
      assert.ok(REDIRECT_URI_REG.test(redirectUri), 'invalid redirect_uri')
      assert.strictEqual(
        responseType,
        RESPONSE_TYPE,
        'Only support Authorization code flow, rather than implicit code flow.'
      )

      const authCode = await Promise.resolve(SAMPLE_AUTHORIZATION_CODE)

      // Google will send a GET request with a query string named state which
      // is used to identify what application to link to
      const formattedRedirectUri =
        redirectUri +
        config.GOOGLE_PROJECT_ID +
        `?code=${authCode}` +
        `&state=${state}`

      // Redirect to google site to link user account to user's google account
      this.ctx.redirect(formattedRedirectUri)
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
   * Client secret only attached to Token exchange endpoint request
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

      assert.strictEqual(clientId, config.OAUTH_CLIENT_ID, 'invalid client_id')
      assert.strictEqual(
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
        assert.strictEqual(
          code,
          await Promise.resolve(SAMPLE_AUTHORIZATION_CODE),
          'invalid authorization code'
        )
        assert.strictEqual(grantType, GRANT_TYPES.code, 'invalid grant_type')
        this.ctx.body = {
          token_type: 'Bearer',
          access_token: await Promise.resolve(SAMPLE_ACCESS_TOKEN),
          refresh_token: await Promise.resolve(SAMPLE_REFRESH_TOKEN),
          expires_in: SECONDS_TO_EXPIRATION
        }
        return
      }

      /**
       * @token_exchange_endpoint
       * @description exchange refresh token for access token
       */
      if (refreshToken) {
        assert.strictEqual(
          grantType,
          GRANT_TYPES.refreshToken,
          'invalid grant_type'
        )
        assert.strictEqual(
          refreshToken,
          await Promise.resolve(SAMPLE_REFRESH_TOKEN),
          'invalid refresh token'
        )
        this.ctx.body = {
          token_type: 'Bearer',
          access_token: await Promise.resolve(SAMPLE_ACCESS_TOKEN),
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
