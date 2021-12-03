const express = require('express')
const dotenv = require('dotenv')

const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('<h1>🤖 Teaming up with NodeJS and SQL Server</h1>');
});

app.use('/api/employees', require('./api/employees'));
app.use('/api/employees-variant', require('./api/employees-variant'));
app.use('/api/users', require('./api/users'));

app.listen(process.env.PORT, () => {
    console.log(`Server started running on ${process.env.PORT} for ${process.env.NODE_ENV}`);
});
