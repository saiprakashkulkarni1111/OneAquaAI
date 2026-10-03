import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  Firestore
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
  firestoreDatabaseId: firebaseConfigJson.firestoreDatabaseId || undefined
};

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with persistent offline cache
let firestoreInstance: Firestore;
try {
  if (firebaseConfig.firestoreDatabaseId) {
    firestoreInstance = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    }, firebaseConfig.firestoreDatabaseId);
  } else {
    firestoreInstance = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });
  }
} catch (e) {
  // If already initialized or cache error fallback to getFirestore
  firestoreInstance = firebaseConfig.firestoreDatabaseId 
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);
}

export const db = firestoreInstance;
export const storage = getStorage(app);
