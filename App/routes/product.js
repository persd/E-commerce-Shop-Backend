const controllers = require('../controllers/product');
const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadFolder = path.resolve(__dirname, '../uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const productName = req.body.name || 'test';
        const productFolderPath = path.join(uploadFolder, productName);
        console.log(productName, productFolderPath);
        if (!fs.existsSync(productFolderPath)) {
            fs.mkdirSync(productFolderPath);
        }
        cb(null, productFolderPath);
    },
    filename: (req, file, cb) => {
        const productName = req.body.name || 'test';
        const timestamp = Date.now();
        const extension = path.extname(file.originalname);
        const fileName = `${timestamp}${extension}`;
        cb(null, fileName);
    },
});
const upload = multer({ storage });

router.get('/:productId', controllers.getProductById);
router.post('/search', controllers.searchProducts);

router.get('/', authMiddleware(true), controllers.getAllProducts);
router.post(
    '/uploads',
    authMiddleware(true),
    upload.array('images', 10),
    controllers.createProduct
);
router.delete('/:productId', authMiddleware(true), controllers.deleteProduct);

module.exports = router;
