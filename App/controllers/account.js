const UserModel = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Order = require('../models/Order');
const bcryptSalt = bcrypt.genSaltSync(10);
module.exports = {
    getUserById: async (req, res) => {
        try {
            const userId = req.user._id;

            const { id, firstName, lastName, email, phoneNumber } =
                await UserModel.findById(userId);

            res.json({ id, firstName, lastName, email, phoneNumber });
        } catch (error) {
            res.json(error);
        }
    },
    editUserPersonalData: async (req, res) => {
        try {
            const { ...data } = req.body;

            if ('actualPassword' in data) {
                const userData = await UserModel.findById(req.user._id);

                if (userData) {
                    const passCheck = bcrypt.compareSync(
                        data.actualPassword,
                        userData.password
                    );

                    if (passCheck) {
                        await UserModel.findByIdAndUpdate(req.user._id, {
                            password: bcrypt.hashSync(
                                data.newPassword,
                                bcryptSalt
                            ),
                        });
                    }
                }
            } else {
                await UserModel.findByIdAndUpdate(req.user._id, {
                    ...data,
                });
            }
            res.status(200).json({ message: 'Dane zostały zaktualizowane' });
        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json({
                    message: 'Konto o takim adresie email już istnieje',
                });
            } else {
                res.json({ ...error });
            }
        }
    },
    storeStats: async (req, res) => {
        const usersAmount = await UserModel.count();
        const ordersAmount = await Order.count();
        const totalOrdersValue = await Order.aggregate([
            {
                $group: {
                    _id: '',
                    total: {
                        $sum: '$total',
                    },
                },
            },
        ]);

        res.json({
            usersAmount,
            ordersAmount,
            totalOrdersValue: totalOrdersValue[0]?.total || 0,
        });
    },
};
