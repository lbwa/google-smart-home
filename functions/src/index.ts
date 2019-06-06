// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as functions from 'firebase-functions'
import { Request, Response } from 'express'
import { format } from 'util'
import {
  verifyClientId,
  verifyRedirectUri,
  verifyResponseType,
  createAuthCodeForExchangingToken
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
  (request: Request, response: Response) => {
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
     * Redirect result:
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
 */
