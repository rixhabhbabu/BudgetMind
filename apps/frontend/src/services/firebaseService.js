import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail
} from "firebase/auth";
import { firebaseAuth } from "../config/firebase.js";

const googleProvider = new GoogleAuthProvider();

export async function firebaseRegister(email, password, name) {
  const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  
  // Get ID token to send to backend
  const token = await userCredential.user.getIdToken();
  
  return {
    token,
    user: {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      name: name || userCredential.user.displayName,
      emailVerified: userCredential.user.emailVerified
    }
  };
}

export async function firebaseLogin(email, password) {
  const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
  
  // Get ID token to send to backend
  const token = await userCredential.user.getIdToken();
  
  return {
    token,
    user: {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      name: userCredential.user.displayName,
      emailVerified: userCredential.user.emailVerified
    }
  };
}

export async function firebaseGoogleSignIn() {
  const result = await signInWithPopup(firebaseAuth, googleProvider);
  
  // Get ID token to send to backend
  const token = await result.user.getIdToken();
  
  return {
    token,
    user: {
      uid: result.user.uid,
      email: result.user.email,
      name: result.user.displayName,
      photoURL: result.user.photoURL,
      emailVerified: result.user.emailVerified
    }
  };
}

export async function firebaseLogout() {
  await signOut(firebaseAuth);
}

export async function firebasePasswordReset(email) {
  await sendPasswordResetEmail(firebaseAuth, email);
}

export function getCurrentUser() {
  return firebaseAuth.currentUser;
}
