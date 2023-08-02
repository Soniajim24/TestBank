import connectToDatabase from '../../../database';
import { getUserByEmail } from '../../../dal/user-dal';

export default async (req, res) => {
  
  try {
    // Connect to the database
    await connectToDatabase();

    // Get the Email parameter from the request URL
    const { email } = req.query;

    // Call the getUserByEmail function to retrieve the user with the specified Email
    const user = await getUserByEmail(email);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user as a JSON response
    res.json(user);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('An error occurred while connecting to the database.');
  }
};
try {
  const docRef = await addDoc(collection(db, "Bank"), {
    Email: "klaus@mit.edu",
    Balance: "100",
  });
  console.log("Document written with ID: ", docRef.id);
} catch (e) {
  console.error("Error adding document: ", e);
}

