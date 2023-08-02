import { updateUserById } from '../../../dal/user-dal';

export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    switch (method) {
        case 'PUT':
            try {
                const updatedUser = await updateUserById(id, req.body);
                res.status(200).json(updatedUser);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
            break;
        default:
            res.setHeader('Allow', ['PUT']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
