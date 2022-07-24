const express = require('express')
const dotenv = require('dotenv')

const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('<h1>🤖 Shiraz University Assignment 2 🤖</h1>');
});

app.use('/api/webservice', require('./api/service-handler'));

app.listen(process.env.PORT, () => {
    console.log(`Server started running on ${process.env.PORT} for ${process.env.NODE_ENV}`);
});
