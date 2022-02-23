import { User, UserId } from '@machikoro/game-server-contracts';
import { signInAnonymously, Auth } from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';

import { RegisterGuest } from '../login';
import { GetUserData } from '../user.api.types';

export const registerFirebaseGuest = (firestore: Firestore, firebaseAuth: Auth): RegisterGuest => async (username) => {
  const anonymusCredentials = await signInAnonymously(firebaseAuth);

  await setDoc(doc(firestore, 'users', anonymusCredentials.user.uid), {
    userId: anonymusCredentials.user.uid,
    username,
    createdAt: serverTimestamp(),
  });

  return {
    userId: anonymusCredentials.user.uid as UserId,
    username,
  };
};

export const getFirebaseUserData = (firestore: Firestore): GetUserData => async (userId) => {
  const userDocumentRef = doc(firestore, 'users', userId);

  const userSnapshot = await getDoc(userDocumentRef);

  if (!userSnapshot.exists()) return undefined;

  // TODO: peform validation
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const user = userSnapshot.data() as User;

  return user;
};
