import firebase from 'firebase/app'
import 'firebase/database'

import { project_id, google_api_key } from '../config/index.json'

firebase.initializeApp({
  apiKey: google_api_key,
  projectId: project_id,
  databaseURL: `https://${project_id}.firebaseio.com`
})

export const db = firebase.database()

export const dbRef = db.ref('/')
