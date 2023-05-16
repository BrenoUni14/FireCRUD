const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require('../fatecweb-32840-firebase-adminsdk-3q5xm-e05c652711.json');

initializeApp({
                  credential: cert(serviceAccount)
});

const db = getFirestore();

const res = db.collection('cities').doc('SF').delete();