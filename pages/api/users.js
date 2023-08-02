import connectToDatabase from '../../database';
import { getAllUsers } from '../../dal/user-dal';

export default async (req, res) => {
    try {
        // Connect to the database
        await connectToDatabase();

        // Find all users using the DAL function
        const users = await getAllUsers();

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while connecting to the database.');
    }
};
