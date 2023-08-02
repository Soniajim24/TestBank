import connectToDatabase from '../../../database';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/initAuth';

const createUser = async (userData) => {
  try {
    const docRef = await addDoc(collection(db, 'Bank'), userData);
    console.log('Document written with ID:', docRef.id);
    return { id: docRef.id, ...userData };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export default async (req, res) => {
  try {
    await connectToDatabase();
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while creating the user.');
  }
};
