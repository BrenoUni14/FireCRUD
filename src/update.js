const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');


const serviceAccount = require('../fatecweb-32840-firebase-adminsdk-3q5xm-e05c652711.json');

initializeApp({
                  credential: cert(serviceAccount)
});

const db = getFirestore();

const documentRef = db.collection('cities').doc('LA');

documentRef.update({
                  name: 'Los Angeles - Lakers', state: 'CA', country: 'USA',
                  capital: true, population: 5000000
})
.then(() => {
                  console.log('Documento atualizado com sucesso!');
})
.catch((error) => {
                  console.error('Erro ao atualizar documento:', error);
});