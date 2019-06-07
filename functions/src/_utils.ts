const CLIENT_ID = 'use_to_verify_correct_request_origin'
const REDIRECT_URI_REG = /^https:\/\/oauth-redirect.googleusercontent.com\/r\//
const OATH_TYPE = 'code'

export function verifyClientId(clientId: string) {
  return clientId === CLIENT_ID
}

export function verifyRedirectUri(uri: string) {
  return REDIRECT_URI_REG.test(uri)
}

export function verifyResponseType(type: string) {
  /**
   * Google home action only support `Authorization code` OAuth flow
   * DOC: https://developers.google.com/actions/smarthome/concepts/fulfillment-authentication#authentication
   *
   * OAuth 2.0 has two types (implicit and authorization code flow)
   * DOC: https://developers.google.com/actions/identity/oauth2?oauth=code
   */
  return OATH_TYPE === type
}

export function createAuthCodeForExchangingToken() {
  /* implement simply */
  return Math.random().toString(16).slice(2)
}
