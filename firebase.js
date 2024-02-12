import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBytwG_CtNIdtxz53NHw1EA5hohnbVR7DE",
  authDomain: "movies-app-15da0.firebaseapp.com",
  projectId: "movies-app-15da0",
  storageBucket: "movies-app-15da0.appspot.com",
  messagingSenderId: "727809307108",
  appId: "1:727809307108:web:419c4d982ab6733721d7f1"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db = getFirestore(app);


export { app, auth, db };