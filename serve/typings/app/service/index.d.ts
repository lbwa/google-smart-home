// This file is created by egg-ts-helper@1.25.4
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportSmartHome from '../../../app/service/SmartHome';
import ExportTest from '../../../app/service/Test';

declare module 'egg' {
  interface IService {
    smartHome: ExportSmartHome;
    test: ExportTest;
  }
}
