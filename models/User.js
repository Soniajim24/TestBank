const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with your service account credentials
const serviceAccount = require('../badbank-eb5fc-firebase-adminsdk-s8fp6-1857dd3717.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  
  const db = admin.firestore();
  
  const User = db.collection('Bank');

function generateAccountNumber() {
    // Generate a random account number
    const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
    return randomNumber.toString();
}


module.exports = User;

