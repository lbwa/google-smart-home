const CLIENT_ID = 'use_to_verify_correct_request_origin'
const CLIENT_SECRET = 'use_to_verify_to_access_our_service'
const REDIRECT_URI_REG = /^https:\/\/oauth-redirect.googleusercontent.com\/r\//
const OATH_TYPE = 'code'

function createRandomString(type: string = 'random') {
  return `${type}_${Math.random()
    .toString(16)
    .slice(2)}`
}

export function verifyClientId(clientId: string) {
  return clientId === CLIENT_ID
}

export function verifyClientSecret(clientSecret: string) {
  return clientSecret === CLIENT_SECRET
}

export function verifyRedirectUri(uri: string) {
  return REDIRECT_URI_REG.test(uri)
}

/**
 * Google home action only support `Authorization code` OAuth flow
 * DOC: https://developers.google.com/actions/smarthome/concepts/fulfillment-authentication#authentication
 *
 * OAuth 2.0 has two types (implicit and authorization code flow)
 * DOC: https://developers.google.com/actions/identity/oauth2?oauth=code
 */
export function verifyResponseType(type: string) {
  return OATH_TYPE === type
}

export function createAuthCodeForExchangingToken() {
  /* implement simply */
  return createRandomString('authorization_code')
}

/**
 * @description Include expiration verification, and clientId must match the
 * clientId associated with the authorization code
 */
export function verifyAuthorizationCodeWithClientId({
  code,
  clientId
}: {
  code: string
  clientId: string
}) {
  return !!code && !!clientId
}

export function verifyRefreshTokenWithClientId({
  refreshToken,
  clientId
}: {
  refreshToken: string
  clientId: string
}) {
  return !!refreshToken || !!clientId
}

export function createTokenFromUserID({
  userId,
  type,
  expires = 86400
}: {
  userId: string
  type: string
  expires?: number
}) {
  if (type === 'authorization_code') {
    return {
      token_type: 'bearer',
      // Access token should has a short-time life-cycle(eg. 1 hour)
      access_token: createRandomString(`access_token_${userId}`),
      // Refresh tokens do not expire, to get new access token
      refresh_token: createRandomString(`refresh_token_${userId}`),
      expires_in: expires
    }
  }
  if (type === 'refresh_token') {
    return {
      token_type: 'bearer',
      access_token: createRandomString(`access_token_${userId}`),
      expires_in: expires
    }
  }
  throw new Error('[createTokenFromUserID]: invalid type')
}
