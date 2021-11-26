import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
var firebaseConfig = {
    apiKey: "AIzaSyCrd7Qw9-Zdr4BISIqYKbDR7q1XFwXd6C0",
    authDomain: "gifted-chat-2c23e.firebaseapp.com",
    projectId: "gifted-chat-2c23e",
    storageBucket: "gifted-chat-2c23e.appspot.com",
    messagingSenderId: "225168459423",
    appId: "1:225168459423:web:7121b9cc961e461b6bc4aa"
  };

let app;
if(firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig);
}else{
    app = firebase.app()
}
const db = app.firestore();
const auth = firebase.auth();
const storage = app.storage;
export{db, auth, storage};