import { signInAnonymously, Auth } from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Firestore,
  Timestamp,
} from 'firebase/firestore';

import { RegisterGuest } from '../login';
import { GetUserData } from '../user.api.types';

export const registerFirebaseGuest = (firestore: Firestore, firebaseAuth: Auth): RegisterGuest => async (username) => {
  const anonymusCredentials = await signInAnonymously(firebaseAuth);

  await setDoc(doc(firestore, 'users', anonymusCredentials.user.uid), {
    uid: anonymusCredentials.user.uid,
    username,
    createdAt: serverTimestamp(),
  });

  return {
    userId: anonymusCredentials.user.uid,
    username,
  };
};

export const getFirebaseUserData = (firestore: Firestore): GetUserData => async (userId) => {
  const userDocumentRef = doc(firestore, 'users', userId);

  const userSnapshot = await getDoc(userDocumentRef);

  if (!userSnapshot.exists()) return undefined;

  // TODO: peform validation
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const user = userSnapshot.data() as { uid: string; username: string; createdAt: Timestamp };

  return {
    userId: user.uid,
    username: user.username,
  };
};
