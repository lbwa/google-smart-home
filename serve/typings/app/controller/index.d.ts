// This file is created by egg-ts-helper@1.25.4
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportSmartHome from '../../../app/controller/smartHome';

declare module 'egg' {
  interface IController {
    smartHome: ExportSmartHome;
  }
}
