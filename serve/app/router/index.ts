import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app

  router.post('/user/create', controller.user.createUser)
  router.post('/smart_home', controller.smartHome.index)
}
