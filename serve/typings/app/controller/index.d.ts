// This file is created by egg-ts-helper@1.25.4
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportHome from '../../../app/controller/home';
import ExportSmartHome from '../../../app/controller/smartHome';

declare module 'egg' {
  interface IController {
    home: ExportHome;
    smartHome: ExportSmartHome;
  }
}
