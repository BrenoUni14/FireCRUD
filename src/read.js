const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');


const serviceAccount = require('../fatecweb-32840-firebase-adminsdk-3q5xm-e05c652711.json');

initializeApp({
                  credential: cert(serviceAccount)
});

const db = getFirestore();


db.collection('cities').get()
                  .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                  const dados = doc.data();
                  console.log(dados);
                  });
}).catch((error) => {
                  console.error('Erro ao ler dados da coleção:', error);
});

console.log('Hello there, Firestore!');
