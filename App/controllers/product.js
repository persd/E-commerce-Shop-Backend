const stripe = require('../config/stripe');
const fs = require('fs');
const ProductModel = require('../models/Product');
const path = require('path');
const uploadFolder = path.resolve(__dirname, '../uploads');
module.exports = {
    createProduct: async (req, res) => {
        try {
            const productName = req.body.name;

            const productFolderPath = path.join(uploadFolder, productName);
            fs.readdir(productFolderPath, async (err, files) => {
                const { images, ...rest } = req.body;

                if (err) {
                    return res.status(500).json({
                        error: 'Wystąpił błąd przy czytaniu folderu z obrazami.',
                    });
                }
                const imageLinks = files.map((fileName) => {
                    return `http://localhost:5000/${productName}/${fileName}`;
                });
                try {
                    const product = await ProductModel.create({
                        ...rest,
                        images: imageLinks,
                    });
                    res.status(200).json({ product });
                } catch (error) {
                    if (error.code === 11000) {
                        res.status(409).json({
                            message: 'Product o takiej nazwie już istnieje',
                        });
                    } else {
                        res.send(error);
                    }
                }
            });
        } catch (error) {
            res.status(400).send(error);
        }
    },
    getProductById: async (req, res) => {
        try {
            const productId = req.params.productId;
            const product = await ProductModel.findById(productId, {
                'sizes._id': 0,
            });
            res.json({ product });
        } catch (error) {
            console.error(error);
            res.status(400).send(error);
        }
    },
    getAllProducts: async (req, res) => {
        try {
            const products = await ProductModel.find();

            res.json(products);
        } catch (err) {
            res.status(500).send(err);
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const id = req.params.productId;
            const { name } = await ProductModel.findById(id);

            await ProductModel.findByIdAndDelete(id);
            fs.rm(`${uploadFolder}/${name}`, { recursive: true }, (err) => {
                if (err) {
                    res.status(500).send(
                        'Wystąpił błąd podczas usuwania folderu.'
                    );
                }
            });
            res.status(200).send('Produkt został usunięty');
        } catch (e) {
            console.error(e);
            res.status(500).send(e);
        }
    },
    searchProducts: async (req, res) => {
        try {
            const { category, searchName } = req.body;

            const params = {};

            if (category) params.category = category;
            if (searchName)
                params.name = { $regex: new RegExp(searchName, 'i') };

            const products = await ProductModel.find(params);

            res.json(products);
        } catch (e) {
            console.error(e);
            res.status(500).send(e);
        }
    },
};
