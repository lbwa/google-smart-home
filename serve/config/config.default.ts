import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg'
import {
  oauth_client_id as OAUTH_CLIENT_ID,
  oauth_client_secret as OAUTH_CLIENT_SECRET,
  google_project_id as GOOGLE_PROJECT_ID,
  google_api_key as GOOGLE_API_KEY
} from './index.json'

const SECURITY_WHITELIST = ['/smart_home', '/token']

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1560333572955_8839'

  // add your egg config in here
  config.middleware = []

  // egg security
  config.security = {
    csrf: {
      ignore: ctx =>
        SECURITY_WHITELIST.some(path => new RegExp(path).test(ctx.path))
    }
  }

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    OAUTH_CLIENT_ID,
    OAUTH_CLIENT_SECRET,
    GOOGLE_PROJECT_ID,
    GOOGLE_API_KEY,
    // mongoose
    mongoose: {
      client: {
        url: 'mongodb://localhost/smartHome',
        options: {},
        // mongoose global plugins, expected a function or an array of function and options
        plugins: []
      }
    }
  }

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig
  }
}
