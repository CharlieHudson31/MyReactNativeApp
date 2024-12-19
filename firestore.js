import { collection, getDocs, addDoc } from 'firebase/firestore/lite';
import db from './firebaseConfig'

async function getCollection(db) {
    const Col = collection(db, 'user');
    //const Col_Snapshot = await getDocs(Col);
    //const cityList = citySnapshot.docs.map(doc => doc.data());
    return Col;
  }


// Function to add a document to Firestore
async function addToFirestore(username) {
    try {
        // Await the collection reference
        const myCol = await getCollection(db);

        // Add a document to the collection
        const docRef = await addDoc(myCol, {
            name: username,
        });

        console.log("Document written with ID: ", docRef.id);
        //return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}
export default addToFirestore