const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, collection, getDocs, getDoc, Timestamp, FieldValue } = require('firebase-admin/firestore');
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";


const serviceAccount = require('../fatecweb-32840-firebase-adminsdk-3q5xm-e05c652711.json');

initializeApp({
                  credential: cert(serviceAccount)
});

const db = getFirestore();

const auth = getAuth(firebaseApp);
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });

//Detect auth state
onAuthStateChanged(auth, user => {
                  if(user != null){
                                    console.log("Logged in!");
                  } else{
                                    console.log("No user");
                  }
});


/*
const data = {
                  name: 'Los Angeles',
                  state: 'CA',
                  country: 'USA'
};

// Add a new document in collection "cities" with ID 'LA'
const res = await db.collection('cities').doc('LA').set(data);
*/

const citiesRef = db.collection('cities');

citiesRef.doc('SF').set({
                  name: 'San Francisco', state: 'CA', country: 'USA',
                  capital: false, population: 860000
});
citiesRef.doc('LA').set({
                  name: 'Los Angeles', state: 'CA', country: 'USA',
                  capital: false, population: 3900000
});
citiesRef.doc('DC').set({
                  name: 'Washington, D.C.', state: null, country: 'USA',
                  capital: true, population: 680000
});
citiesRef.doc('TOK').set({
                  name: 'Tokyo', state: null, country: 'Japan',
                  capital: true, population: 9000000
});
citiesRef.doc('BJ').set({
                  name: 'Beijing', state: null, country: 'China',
                  capital: true, population: 21500000
});