import { Controller } from 'egg'

export default class SmartHomeController extends Controller {
  public async index() {
    const { ctx, service } = this

    try {
      const { requestId, inputs } = ctx.request.body

      /**
       * @description Every request from google has only one intent
       * @ref https://github.com/actions-on-google/actions-on-google-nodejs/blob/v2.8.0/src/service/smarthome/smarthome.ts#L434
       */
      const { intent, payload = {} } = inputs[0]

      ctx.body = await service.smartHome.dispatch({
        intent,
        payload,
        requestId
      })
    } catch (err) {
      ctx.status = err.code || 400
      ctx.body = {
        code: err.code || 400,
        message: 'Bad request'
      }
    }
  }
}
