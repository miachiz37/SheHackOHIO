import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase.js";
import { doc, setDoc } from "firebase/firestore";

export async function registerUser(email, password, additionalData) {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store additional user data in Firestore
    await setDoc(doc(db, "users", user.uid), additionalData);

    console.log("User registered and additional data stored successfully");
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
    } 
}