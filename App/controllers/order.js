const OrderModel = require('../models/Order');

module.exports = {
    getAllOrders: async (req, res) => {
        try {
            const orders = await OrderModel.find().populate([
                {
                    path: 'products.productId',
                    model: 'Product',
                },
                {
                    path: 'userId',
                    model: 'User',
                    select: '-password',
                },
            ]);

            res.json(orders);
        } catch (e) {
            res.status(500).send('products');
        }
    },
    getUserOrders: async (req, res) => {
        const userId = req.user._id;

        try {
            const orders = await OrderModel.find({ userId }).populate([
                {
                    path: 'products.productId',
                    model: 'Product',
                },
                {
                    path: 'userId',
                    model: 'User',
                    select: '-password',
                },
            ]);

            res.json(orders);
        } catch (e) {
            res.status(500).send('products');
        }
    },
};
