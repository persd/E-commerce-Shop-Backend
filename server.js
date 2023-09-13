require('dotenv').config();
require('./App/config/db');
const app = require('./App');
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
