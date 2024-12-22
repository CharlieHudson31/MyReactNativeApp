import { collection, doc, getDoc, getDocs, addDoc, updateDoc, setDoc } from 'firebase/firestore/lite';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import db, {auth} from './firebaseConfig'

export async function getDocumentById(collectionName, documentId) {
    try {
        // Reference the document
        console.log("name: " + collectionName + "\nid: " + documentId)
        const docRef = doc(db, collectionName, documentId);
        //console.log("name: " + collectionName + "\nid: " + documentId + "ref: " + docRef)
        // Fetch the document
        const docSnap = await getDoc(docRef);
        console.log(docSnap)
        if (docSnap.exists()) {
            console.log('Document data:', docSnap.data());
            return docSnap.data(); // Return the document data if needed
        } else {
            console.log('No such document!');
        }
    } catch (error) {
        console.error('Error fetching document:', error);
    }
}

export async function addToUserFriendsList(userUid, friendUid) {
    try {
        // Reference to the user's document by their UID
        const userDocRef = doc(db, 'user', userUid); // Assuming 'user' is your collection name

        // Get the document
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            // Document exists, let's update the friends list
            const userData = docSnap.data();

            // Check if friends list exists, if not, initialize it
            const updatedFriendsList = userData.friendsList || [];
            
            // Add the new friend UID to the friends list (if not already present)
            if (!updatedFriendsList.includes(friendUid)) {
                updatedFriendsList.push(friendUid);
            }

            // Update the document with the new friends list
            await updateDoc(userDocRef, {
                friendsList: updatedFriendsList,
            });

            console.log('User\'s friends list updated:', updatedFriendsList);
        } else {
            console.log('No such document!');
        }
    } catch (error) {
        console.error('Error adding to friends list:', error);
    }
}

// Sign up a new user
export async function signUp(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User signed up:", userCredential.user);
        add_user_to_db(userCredential.user.uid, email)
    } catch (error) {
        console.error("Error signing up:", error);
        throw error;
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
        throw error;
    }
}

export async function add_user_to_db(uid, user_email){
    /*
    Given a valid uid, and the associated email,
    a new document will be created for the user.
    A empty friends list will be added to the document.
    If the user's uid is already associated with a 
    document, it will return an exception.
    */ 
    try {
        // Reference to the user's document by their UID
        const userDocRef = doc(db, "user", uid); // "users" is the collection name

        // Check if the document already exists
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            // Document exists, let's update the friends list
            throw new Error(`Document with ID ${uid} already exists.`);
        } else {
            const data = {
                email: user_email,
                friendsList: [],
            }
            await setDoc(userDocRef, data);
            console.log("Document created successfully.");

        }
    } catch (error) {
        console.error('Error adding to user to database', error);
    }
}
