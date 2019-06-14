import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app

  router.get('/', controller.home.index)
  router.post('/smart_home', controller.smartHome.index)
}
