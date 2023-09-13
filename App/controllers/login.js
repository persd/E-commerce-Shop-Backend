const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtSecret = process.env.JWT_SECRET;
const UserModel = require('../models/User');

module.exports = {
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;

            const userData = await UserModel.findOne({
                email: email,
            });
            if (userData) {
                const passCheck = bcrypt.compareSync(
                    password,
                    userData.password
                );
                if (passCheck) {
                    jwt.sign(
                        {
                            email: userData.email,
                            id: userData._id,
                            firstName: userData.firstName,
                            lastName: userData.lastName,
                        },

                        jwtSecret,
                        { expiresIn: '3d' },
                        (error, token) => {
                            if (error) {
                                throw error;
                            }
                            res.cookie('token', token).json(userData);
                        }
                    );
                } else {
                    res.status(401).json('Password is invalid');
                }
            } else {
                res.status(401).json('User not found');
            }
        } catch (error) {
            res.status(401).json(error.message);
        }
    },
    checkUser: async (req, res) => {
        const { token } = req.cookies;
        try {
            if (token) {
                jwt.verify(token, jwtSecret, {}, async (error, cookieData) => {
                    if (error) {
                        throw error;
                    }

                    const { _id, email } = await UserModel.findById(
                        cookieData.id
                    );
                    res.json({ _id, email });
                });
            } else {
                throw error;
            }
        } catch (error) {
            res.status(401).json({ error: 'Użytkownik nie jest zalogowany.' });
        }
    },
    logout: async (req, res) => {
        res.cookie('token', '').json(true);
    },
};
