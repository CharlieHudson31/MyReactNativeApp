import { collection, doc, getDoc, getDocs, addDoc, updateDoc, setDoc,  query, where } from 'firebase/firestore/lite';
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
export async function addToUserFriendsListByEmail(userUid, friendEmail) {
    try {
        // Step 1: Query the database for a document with the specified email
        const usersCollectionRef = collection(db, 'user'); // Assuming 'user' is your collection name
        const q = query(usersCollectionRef, where('email', '==', friendEmail));
        const querySnapshot = await getDocs(q);
  
        if (querySnapshot.empty) {
            console.log('No user found with the specified email:', friendEmail);
            return;
        }
  
        // Step 2: Extract the friend's UID from the query result
        const friendDoc = querySnapshot.docs[0];
        const friendEmailFromDoc = friendDoc.data().email;
  
        // Step 3: Reference to the user's document by their UID
        const userDocRef = doc(db, 'user', userUid);
  
        // Get the user's document
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
            // Document exists, let's update the friends list
            const userData = userDocSnap.data();
  
            // Check if friends list exists, if not, initialize it
            const updatedFriendsList = userData.friendsList || [];
  
            // Add the new friend UID to the friends list (if not already present)
            if (!updatedFriendsList.includes(friendEmailFromDoc)) {
                updatedFriendsList.push(friendEmailFromDoc);
  
                // Update the document with the new friends list
                await updateDoc(userDocRef, {
                    friendsList: updatedFriendsList,
                });
  
                console.log('User\'s friends list updated:', updatedFriendsList);
            } else {
                console.log('Friend already in the user\'s friends list.');
            }
        } else {
            console.log('No such document for user UID:', userUid);
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
