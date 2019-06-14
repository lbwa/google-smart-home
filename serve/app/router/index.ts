import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app

  router.post('/smart_home', controller.smartHome.index)
}
