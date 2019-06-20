// This file is created by egg-ts-helper@1.25.4
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportDevices from '../../../app/model/Devices';
import ExportUsers from '../../../app/model/Users';

declare module 'egg' {
  interface IModel {
    Devices: ReturnType<typeof ExportDevices>;
    Users: ReturnType<typeof ExportUsers>;
  }
}
