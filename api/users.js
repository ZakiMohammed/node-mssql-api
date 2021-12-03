const express = require('express')
const DataAccess = require('../data-access')

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await DataAccess.query(`SELECT * FROM [User] ORDER BY Id DESC`);
        const users = result.recordset;

        res.json(users);
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
});

module.exports = router;