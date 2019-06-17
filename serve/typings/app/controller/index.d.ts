// This file is created by egg-ts-helper@1.25.4
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportOauth from '../../../app/controller/oauth';
import ExportSmartHome from '../../../app/controller/smartHome';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    oauth: ExportOauth;
    smartHome: ExportSmartHome;
    user: ExportUser;
  }
}
