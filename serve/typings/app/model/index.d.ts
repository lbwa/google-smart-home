// This file is created by egg-ts-helper@1.25.4
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportDevices from '../../../app/model/Devices';
import ExportUser from '../../../app/model/User';

declare module 'egg' {
  interface IModel {
    Devices: ReturnType<typeof ExportDevices>;
    User: ReturnType<typeof ExportUser>;
  }
}
