const express = require('express')
const mssql = require('mssql')

const router = express.Router();

const config = {
    driver: process.env.SQL_DRIVER,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    user: process.env.SQL_UID,
    password: process.env.SQL_PWD,
    options: {
        encrypt: false,
        enableArithAbort: false
    },
};
const pool = new mssql.ConnectionPool(config);

router.get('/:id', async (req, res) => {
    try {
        await pool.connect();
        const result = await pool.request()
            .input('Id', req.params.id)
            .query(`SELECT * FROM Employee WHERE Id = @Id`);
        const employee = result.recordset.length ? result.recordset[0] : null;

        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({
                message: 'Record not found'
            });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});
router.get('/', async (req, res) => {
    try {
        await pool.connect();
        const result = await pool.request().query(`SELECT * FROM Employee ORDER BY Id DESC`);
        const employees = result.recordset;

        res.json(employees);
    } catch (error) {
        res.status(500).json(error);
    }
});
router.post('/', async (req, res) => {
    try {
        await pool.connect();
        const result = await pool.request()
            .input('Code', req.body.Code)
            .input('Salary', req.body.Salary)
            .input('Job', req.body.Job)
            .input('Department', req.body.Department)
            .input('Name', req.body.Name)
            .query(`
                INSERT INTO Employee (Code, Salary, Job, Department, Name) 
                OUTPUT inserted.Id 
                VALUES (@Code, @Salary, @Job, @Department, @Name);
            `);
        const employee = req.body;
        employee.Id = result.recordset[0].Id;
        res.json(employee);
    } catch (error) {
        res.status(500).json(error);
    }
});
router.put('/:id', async (req, res) => {
    try {
        await pool.connect();
        const result = await pool.request()
            .input('Id', req.params.id)
            .query(`SELECT * FROM Employee WHERE Id = @Id`);

        let employee = result.recordset.length ? result.recordset[0] : null;
        if (employee) {
            await pool.request()
                .input('Id', req.params.id)
                .input('Code', req.body.Code)
                .input('Salary', req.body.Salary)
                .input('Job', req.body.Job)
                .input('Department', req.body.Department)
                .input('Name', req.body.Name)
                .query(`
                    UPDATE Employee SET
                        Code = @Code, 
                        Salary = @Salary, 
                        Job = @Job, 
                        Department = @Department, 
                        Name = @Name
                    WHERE Id = @Id;
                `);

            employee = { ...employee, ...req.body };

            res.json(employee);
        } else {
            res.status(404).json({
                message: 'Record not found'
            });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});
router.delete('/:id', async (req, res) => {
    try {
        await pool.connect();
        const result = await pool.request()
            .input('Id', req.params.id)
            .query(`SELECT * FROM Employee WHERE Id = @Id`);

        let employee = result.recordset.length ? result.recordset[0] : null;
        if (employee) {
            await pool.request()
                .input('Id', req.params.id)
                .query(`DELETE FROM Employee WHERE Id = @Id;`);
            res.json(employee);
        } else {
            res.status(404).json({
                message: 'Record not found'
            });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;