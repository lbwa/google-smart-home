import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app

  /**
   * @description Authorization code endpoint of OAuth 2.0
   */
  router.get('/auth', controller.oauth.authCode)
  /**
   * @description Token exchange endpoint of OAuth 2.0
   */
  router.post('/token', controller.oauth.token)

  /**
   * @description Smart Home fulfillment which is used to handle Google smart
   * home intents
   */
  router.post('/user/create', controller.user.createUser)
  router.post('/smart_home', controller.smartHome.index)
}
