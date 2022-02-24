import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCjaFeYVbx__DdDl_fLwOFWzPRYwQuHH0s",
  authDomain: "curso-45f02.firebaseapp.com",
  projectId: "curso-45f02",
  storageBucket: "curso-45f02.appspot.com",
  messagingSenderId: "653644339387",
  appId: "1:653644339387:web:48784b323b1fd21b6af19e",
  measurementId: "G-T12MP5TZXF"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
};

export default firebase;