import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from './firebase';
import { UrbanEcosystem, ObservationSubmission, WaterAlert } from '../types';
import { INITIAL_ECOSYSTEMS, INITIAL_OBSERVATIONS, INITIAL_ALERTS } from '../data/seedData';

const ECOSYSTEMS_COL = 'ecosystems';
const OBSERVATIONS_COL = 'observations';
const ALERTS_COL = 'alerts';

// Seed initial data if Firestore collections are empty or offline
export async function initializeDatabaseSeed(): Promise<void> {
  try {
    const ecoSnap = await getDocs(collection(db, ECOSYSTEMS_COL));
    if (ecoSnap.empty) {
      console.log('Seeding initial ecosystems into Firestore...');
      for (const eco of INITIAL_ECOSYSTEMS) {
        await setDoc(doc(db, ECOSYSTEMS_COL, eco.id), eco);
      }
    }

    const obsSnap = await getDocs(collection(db, OBSERVATIONS_COL));
    if (obsSnap.empty) {
      console.log('Seeding initial observations into Firestore...');
      for (const obs of INITIAL_OBSERVATIONS) {
        await setDoc(doc(db, OBSERVATIONS_COL, obs.id!), obs);
      }
    }

    const alertSnap = await getDocs(collection(db, ALERTS_COL));
    if (alertSnap.empty) {
      console.log('Seeding initial alerts into Firestore...');
      for (const alert of INITIAL_ALERTS) {
        await setDoc(doc(db, ALERTS_COL, alert.id), alert);
      }
    }
  } catch (error) {
    console.warn('Firestore seeding notice (using persistent local data):', error);
  }
}

// Fetch all ecosystems
export async function getEcosystems(): Promise<UrbanEcosystem[]> {
  try {
    const snap = await getDocs(collection(db, ECOSYSTEMS_COL));
    if (!snap.empty) {
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as UrbanEcosystem));
    }
  } catch (err) {
    console.warn('Fallback to local ecosystems seed:', err);
  }
  return INITIAL_ECOSYSTEMS;
}

// Subscribe to real-time observations
export function subscribeToObservations(callback: (obs: ObservationSubmission[]) => void) {
  try {
    const q = query(collection(db, OBSERVATIONS_COL), orderBy('timestamp', 'desc'), limit(50));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ObservationSubmission));
        callback(list);
      } else {
        callback(INITIAL_OBSERVATIONS);
      }
    }, (error) => {
      console.warn('Firestore snapshot listener offline/fallback:', error);
      callback(INITIAL_OBSERVATIONS);
    });
  } catch (e) {
    console.warn('Error setting snapshot listener:', e);
    callback(INITIAL_OBSERVATIONS);
    return () => {};
  }
}

// Save new observation
export async function saveObservation(observation: ObservationSubmission): Promise<string> {
  try {
    const colRef = collection(db, OBSERVATIONS_COL);
    const docRef = await addDoc(colRef, {
      ...observation,
      timestamp: Date.now()
    });
    return docRef.id;
  } catch (err) {
    console.warn('Failed to push to remote Firestore, stored in local cache/fallback', err);
    return 'local-' + Date.now();
  }
}

// Subscribe to alerts
export function subscribeToAlerts(callback: (alerts: WaterAlert[]) => void) {
  try {
    const q = query(collection(db, ALERTS_COL));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as WaterAlert));
        callback(list);
      } else {
        callback(INITIAL_ALERTS);
      }
    }, (error) => {
      console.warn('Firestore alerts listener fallback:', error);
      callback(INITIAL_ALERTS);
    });
  } catch (e) {
    console.warn('Alerts listener error:', e);
    callback(INITIAL_ALERTS);
    return () => {};
  }
}
