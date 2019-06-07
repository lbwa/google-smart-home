// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as functions from 'firebase-functions'
import { format } from 'util'
import {
  verifyClientId,
  verifyClientSecret,
  verifyRedirectUri,
  verifyResponseType,
  createAuthCodeForExchangingToken,
  verifyAuthorizationCodeWithClientId,
  verifyGrantType,
  createTokenFromUserID
} from './_utils'

/**
 * @description Implement OAuth account linking
 * DOC: https://developers.google.com/actions/identity/oauth2?oauth=code#implement_your_oauth_server
 */

/**
 * Implement OAuth account linking, process 1:
 * authorization endpoint
 *
 * Request sample:
 * https://myservice.example.com/auth?client_id=GOOGLE_CLIENT_ID&redirect_uri=REDIRECT_URI&state=STATE_STRING&scope=REQUESTED_SCOPES&response_type=code
 *
 * client_id: The Google client ID you registered with Google.
 * redirect_uri: The URL to which you send the response to this request.
 * state: A bookkeeping value that is passed back to Google unchanged in the redirect URI.
 * scope(Optional): A space-delimited set of scope strings that specify the data Google is requesting authorization for.
 * response_type: The string code.(`code` means OAuth authorization code flow,
 * rather than implicit code flow)
 */
export const oauth = functions.https.onRequest(
  (request: functions.https.Request, response: functions.Response) => {
    const clientId: string = request.query.client_id
    const redirectUri: string = request.query.redirect_uri
    const state: string = request.query.state
    // const scope: string = request.query.scope
    const responseType: string = request.query.response_type
    /**
     * @description client_id and redirect_uri validation,
     * Prevent granting access to unintended or misconfigured client apps
     *
     * point 1.
     *    client_id matches the Google client ID you registered with Google.
     * point 2.
     *    redirect_uri has the following form:
     * https://oauth-redirect.googleusercontent.com/r/YOUR_PROJECT_ID
     *
     * Redirect to google if any verification passed:
     * https://oauth-redirect.googleusercontent.com/r/YOUR_PROJECT_ID?code=AUTHORIZATION_CODE&state=STATE_STRING
     */
    if (
      verifyClientId(clientId) &&
      verifyRedirectUri(redirectUri) &&
      verifyResponseType(responseType)
    ) {
      response.redirect(
        format(
          '%s?code=%s&state=%s',
          decodeURIComponent(redirectUri),
          /**
           * `Auth code` will sent to `Token exchange` endpoint to get access
           * token and refresh token
           *
           * Auth code should include unique use information for token exchange
           */
          createAuthCodeForExchangingToken(),
          state
        )
      )
      return
    }

    return response.status(403).send({
      error: 'Forbidden'
    })
  }
)

/**
 * Implement OAuth account linking process 2:
 * Token exchange endpoint
 *
 * Token exchange requests include the following parameters:
 * client_id: A string that identifies the request origin as Google. This
 * string must be registered within your system as Google's unique identifier.
 *
 * client_secret: A secret string that you registered with Google for your service.
 *
 * grant_type: The type of token being exchanged. Either authorization_code or refresh_token.
 *
 * code: When grant_type=authorization_code, the code Google received from
 * either your sign-in or token exchange endpoint.
 *
 * refresh_token: When grant_type=refresh_token, the refresh token Google received from your token exchange endpoint.
 */
export const token = functions.https.onRequest(
  (request: functions.https.Request, response: functions.Response) => {
    const clientId: string = request.query.client_id
    const clientSecret: string = request.query.client_secret
    const grantType: string = request.query.grant_type
    const authCode: string = request.query.code

    const secondsInDay = 86400

    /**
     * @description Handle two kind of token exchange:
     * 1. Exchanging authorization codes for access tokens and refresh tokens
     * 2. Exchanging refresh tokens for access tokens
     */
    if (
      verifyClientId(clientId) &&
      verifyClientSecret(clientSecret) &&
      /**
       * Include expiration verification, and clientId must match the
       * clientId associated with the authorization code
       */
      verifyAuthorizationCodeWithClientId({ code: authCode, clientId }) &&
      verifyGrantType(grantType)
    ) {
      return response.send(
        // Include two kind of token exchange
        createTokenFromUserID({
          userId: authCode /* user ID from the authorization code */,
          type: grantType,
          expires: secondsInDay
        })
      )
    }
    return response.status(400).send({
      error: 'invalid grant'
    })
  }
)
