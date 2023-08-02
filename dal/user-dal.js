import User from '../models/User';

export const getUserById = async (id) => {
    return await User.findById(id);
};

export const getUserByEmail = async (email) => {
    return await User.findOne({ email });
};

export const getAllUsers = async () => {
    return await User.find();
};

export const createUser = async (userData) => {
    // Assign a random account number to the user
    const user = new User({
        ...userData,
        accountNumber: generateAccountNumber(),
    });
    return await user.save();
};

export const updateUserById = async (id, userData) => {
    console.log(`Updating user with id ${id} and data ${JSON.stringify(userData)}`);
    return await User.findByIdAndUpdate(id, userData, { new: true });
};

export const deleteUserById = async (id) => {
    return await User.findByIdAndDelete(id);
};

function generateAccountNumber() {
    // Generate a random account number
    const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
    return randomNumber.toString();
}

function create(name, email, password){
    return new Promise((resolve, reject) => {
        const collection = db.collection("Bank")
        const doc = { name, email, password, balance: 0}
        collection.insertOne(doc, {w:1}, function(err, result) {
            err ? reject(err) : resolve(doc);
        });
    })
}

module.exports = { create };