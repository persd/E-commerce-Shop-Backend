const bcrypt = require('bcryptjs');
const UserModel = require('../models/User');
const bcryptSalt = bcrypt.genSaltSync(10);
module.exports = {
    registerUser: async (req, res) => {
        try {
            const {
                email,
                password,
                firstName,
                lastName,
                phoneNumber,
                privacyPolicyAccept,
                role,
            } = req.body;
            const user = await UserModel.create({
                email,
                password: bcrypt.hashSync(password, bcryptSalt),
                firstName,
                lastName,
                phoneNumber,
                privacyPolicyAccept,
                role,
            });

            res.status(200).json({ message: 'Pomyślnie zarejestrowano' });
        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json({
                    message: 'Konto o takim adresie email już istnieje',
                });
            } else {
                res.json(error);
            }
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const users = await UserModel.find({}, '-password');

            res.json(users);
        } catch (e) {
            res.status(500).send(e);
        }
    },
};
