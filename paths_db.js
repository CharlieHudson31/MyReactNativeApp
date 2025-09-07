import { collection, doc, getDoc, getDocs, addDoc, updateDoc, setDoc,  query, where, Timestamp } from 'firebase/firestore/lite';
import db, {auth} from './firebaseConfig'
/**
 * Save a path + entry
 * @param {Array} path - [{ latitude, longitude, name }]
 * @param {string} notes - User notes for this entry
 */
export async function savePath(path, notes) {
  const pathId = getPathId(path);
  const pathRef = doc(db, 'paths', pathId); // Document reference
  console.log("Saving path with ID:", pathId);
    if (!pathRef) {
      console.error("Error saving path:", error);
    }
  // Ensure the path document exists (but don't overwrite)
  await setDoc(pathRef, { coordinates: path }, { merge: true });


  const infoRef = collection(pathRef, "info");
  await addDoc(infoRef, {
    notes,
    createdAt: Timestamp.now(), // Client timestamp
  });

  console.log("Path entry added successfully!");
}

/**
 * 
 * @param {Array} path
 */
export async function getEntriesForPath(path) {
  const pathId = getPathId(path);
  const pathRef = doc(db, "paths", pathId);
  const entriesRef = collection(pathRef, "info"); 
  const snapshot = await getDocs(entriesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Generate an ID for a path
function getPathId(path) {
  return path.map(c => `${c.latitude},${c.longitude}`).join("|");
}
