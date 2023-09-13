const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Types.ObjectId, ref: 'User' },
        products: [
            {
                productId: { type: mongoose.Types.ObjectId, ref: 'Product' },
            },
        ],
        total: { type: Number, required: true },
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
