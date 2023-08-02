import { deleteUserById } from '../../../dal/user-dal';

export default async function handler(req, res) {
    const { id } = req.query;

    try {
        const deletedUser = await deleteUserById(id);
        res.status(200).json(deletedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
