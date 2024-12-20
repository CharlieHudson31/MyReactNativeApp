import { collection, getDocs, addDoc } from 'firebase/firestore/lite';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {db, auth} from './firebaseConfig'

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

// Sign up a new user
async function signUp(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User signed up:", userCredential.user);
    } catch (error) {
        console.error("Error signing up:", error);
    }
}

// Log in an existing user
export async function logIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user
        console.log("User logged in:", user.uid);
        return user.uid
        
    } catch (error) {
        console.error("Error logging in:", error);
    }
}

export default addToFirestore