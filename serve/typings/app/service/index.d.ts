// This file is created by egg-ts-helper@1.25.4
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAuth from '../../../app/service/Auth';
import ExportFirestore from '../../../app/service/Firestore';
import ExportSmartHome from '../../../app/service/SmartHome';
import ExportTest from '../../../app/service/Test';

declare module 'egg' {
  interface IService {
    auth: ExportAuth;
    firestore: ExportFirestore;
    smartHome: ExportSmartHome;
    test: ExportTest;
  }
}
