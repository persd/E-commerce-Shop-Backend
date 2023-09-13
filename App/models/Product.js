const { default: mongoose, mongo } = require('mongoose');

const productSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    category: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    material: [{ type: String, required: true }],
    images: [{ type: String, required: true }],
});

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;
