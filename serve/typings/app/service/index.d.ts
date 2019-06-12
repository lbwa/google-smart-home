// This file is created by egg-ts-helper@1.25.4
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportTest from '../../../app/service/Test';
import ExportSmartHomeIndex from '../../../app/service/SmartHome/index';

declare module 'egg' {
  interface IService {
    test: ExportTest;
    smartHome: {
      index: ExportSmartHomeIndex;
    }
  }
}
