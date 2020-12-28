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

router.get('/search', async (req, res) => {
    try {
        await pool.connect();
        const result = await pool.request()
            .input('Name', req.query.name)
            .execute(`SearchEmployee`);
        const employees = result.recordset;

        res.json(employees);
    } catch (error) {
        res.status(500).json(error);
    }
});
router.get('/status', async (req, res) => {
    try {
        await pool.connect();
        const result = await pool.request()
            .output('Count', 0)
            .output('Max', 0)
            .output('Min', 0)
            .output('Average', 0)
            .output('Sum', 0)
            .execute(`GetEmployeesStatus`);
        const status = {
            Count: +result.output.Count,
            Max: +result.output.Max,
            Min: +result.output.Min,
            Average: +result.output.Average,
            Sum: +result.output.Sum
        };

        res.json(status);
    } catch (error) {
        res.status(500).json(error);
    }
});
router.get('/summary', async (req, res) => {
    try {
        await pool.connect();
        const result = await pool.request().execute(`GetSalarySummary`);
        const summary = {
            Department: result.recordsets[0],
            Job: result.recordsets[1],
        };

        res.json(summary);
    } catch (error) {
        res.status(500).json(error);
    }
});
router.post('/many', async (req, res) => {
    try {
        await pool.connect();
        const employeesTable = new mssql.Table();

        employeesTable.columns.add('Code', mssql.VarChar(50));
        employeesTable.columns.add('Name', mssql.VarChar(50));
        employeesTable.columns.add('Job', mssql.VarChar(50));
        employeesTable.columns.add('Salary', mssql.Int);
        employeesTable.columns.add('Department', mssql.VarChar(50));

        const employees = req.body;
        employees.forEach(employee => {
            employeesTable.rows.add(
                employee.Code,
                employee.Name,
                employee.Job,
                employee.Salary,
                employee.Department
            )
        });

        const request = pool.request();
        request.input('Employees', employeesTable);

        const result = await request.execute('AddEmployees');
        const newEmployees = result.recordset;
        res.json(newEmployees);
    } catch (error) {
        res.status(500).json(error);
    }
});

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