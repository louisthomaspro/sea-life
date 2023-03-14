import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  Auth,
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  connectFirestoreEmulator,
  Firestore,
  getFirestore,
} from "firebase/firestore/lite";
import {
  connectStorageEmulator,
  FirebaseStorage,
  getStorage,
} from "firebase/storage";
import { getMessaging, Messaging } from "firebase/messaging";

const clientCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let firebase: FirebaseApp | undefined;

if (getApps().length < 1) {
  firebase = initializeApp(clientCredentials);
}

let firestore: Firestore;
let storage: FirebaseStorage;
let auth: Auth;
let messaging: Messaging;

try {
  firestore = getFirestore(firebase);
  storage = getStorage(firebase);
  auth = getAuth(firebase);
  messaging = getMessaging(firebase);
} catch (error) {
  console.error("Firebase client initialization error", error);
}

const signInWithGoogle = () => {
  return signInWithPopup(auth, new GoogleAuthProvider());
};
const logOut = () => {
  return signOut(auth);
};

const EMULATORS_STARTED = "EMULATORS_STARTED";
function startEmulators() {
  if (!(global as any)[EMULATORS_STARTED]) {
    (global as any)[EMULATORS_STARTED] = true;
    /* Enable below line to connect to the storage emulator */
    connectStorageEmulator(storage, "localhost", 9199);
    /* Enable below line to connect to the firestore emulator */
    connectFirestoreEmulator(firestore, "localhost", 8080);
    /* Enable below line to connect to the auth emulator */
    connectAuthEmulator(getAuth(firebase), "http://localhost:9099", {
      disableWarnings: true,
    });
  }
}

if (process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === "true") {
  startEmulators();
}

export {
  firebase,
  firestore,
  storage,
  auth,
  messaging,
  signInWithGoogle,
  logOut,
};
