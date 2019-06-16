// This file is created by egg-ts-helper@1.25.4
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAuth from '../../../app/service/Auth';
import ExportMongo from '../../../app/service/Mongo';
import ExportSmartHome from '../../../app/service/SmartHome';

declare module 'egg' {
  interface IService {
    auth: ExportAuth;
    mongo: ExportMongo;
    smartHome: ExportSmartHome;
  }
}
