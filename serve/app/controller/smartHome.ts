import { Controller } from 'egg'

export default class SmartHomeController extends Controller {
  public async index() {
    const { ctx, service } = this
    const { requestId, inputs } = ctx.request.body
    const { intent, payload = {} } = inputs[0]

    try {
      ctx.body = await service.smartHome.dispatch({
        type: intent,
        payload,
        requestId
      })
    } catch (err) {
      ctx.status = err.code || 400
      ctx.body = err.msg || 'Bad request'
    }
  }
}
