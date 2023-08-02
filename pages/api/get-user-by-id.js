import connectToDatabase from '../../database';
import { getUserById } from '../../dal/user-dal';

export default async (req, res) => {
  try {
    // Connect to the database
    await connectToDatabase();

    // Get the ID parameter from the request URL
    const { id } = req.query;

    // Call the getUserById function to retrieve the user with the specified ID
    const user = await getUserById(id);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user as a JSON response
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while connecting to the database.');
  }
};
