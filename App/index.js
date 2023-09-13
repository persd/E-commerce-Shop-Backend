const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const serveStatic = require('serve-static');

app.use(serveStatic(path.join(__dirname, 'uploads')));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3000',
    })
);

app.use((req, res, next) => {
    console.log(`[${req.method}]: ${req.path}`);
    next();
});

app.use('/api/register', require('./routes/users'));
app.use('/api/login', require('./routes/login'));
app.use('/api/check', require('./routes/login'));
app.use('/api/users', require('./routes/users'));
app.use('/api', require('./routes/login'));
app.use('/api/account/info', require('./routes/account'));
app.use('/api/product', require('./routes/product'));
app.use('/api/stripe', require('./routes/stripe'));
app.use('/api/order', require('./routes/order'));

module.exports = app;
