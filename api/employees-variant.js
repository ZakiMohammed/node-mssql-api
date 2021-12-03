const express = require('express')
const { Table, VarChar, Int } = require('mssql')
const DataAccess = require('../data-access')

const router = express.Router();

router.get('/search', async (req, res) => {
    try {
        const result = await DataAccess.execute(`SearchEmployee`, [
            { name: 'Name', value: req.query.name }
        ]);
        const employees = result.recordset;

        res.json(employees);
    } catch (error) {
        res.status(500).json(error);
    }
});
router.get('/status', async (req, res) => {
    try {
        const result = await DataAccess.execute(`GetEmployeesStatus`, [], [
            { name: 'Count', value: 0 },
            { name: 'Max', value: 0 },
            { name: 'Min', value: 0 },
            { name: 'Average', value: 0 },
            { name: 'Sum', value: 0 },
        ]);
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
        const result = await DataAccess.execute(`GetSalarySummary`);
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
        const employeesTable = new Table();

        employeesTable.columns.add('Code', VarChar(50));
        employeesTable.columns.add('Name', VarChar(50));
        employeesTable.columns.add('Job', VarChar(50));
        employeesTable.columns.add('Salary', Int);
        employeesTable.columns.add('Department', VarChar(50));

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

        await DataAccess.connect();

        const request = DataAccess.pool.request();
        request.input('Employees', employeesTable);

        const result = await request.execute('AddEmployees');
        const newEmployees = result.recordset;
        res.json(newEmployees);
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const result = await DataAccess.query(`SELECT * FROM Employee WHERE Id = @Id`, [
            { name: 'Id', value: req.params.id }
        ]);
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
        const result = await DataAccess.query(`SELECT * FROM Employee ORDER BY Id DESC`);
        const employees = result.recordset;

        res.json(employees);
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
});
router.post('/', async (req, res) => {
    try {
        /*
        // passing input as arrays
        const result = await DataAccess.query(
            `
                INSERT INTO Employee (Code, Salary, Job, Department, Name) 
                OUTPUT inserted.Id 
                VALUES (@Code, @Salary, @Job, @Department, @Name);
            `,
            [
                { name: 'Code', value: req.body.Code },
                { name: 'Salary', value: req.body.Salary },
                { name: 'Job', value: req.body.Job },
                { name: 'Department', value: req.body.Department },
                { name: 'Name', value: req.body.Name },
            ]
        );
        */

        // passing input as entity
        const result = await DataAccess.queryEntity(
            `
                INSERT INTO Employee (Code, Salary, Job, Department, Name) 
                OUTPUT inserted.Id 
                VALUES (@Code, @Salary, @Job, @Department, @Name);
            `, req.body
        );
        const employee = req.body;
        employee.Id = result.recordset[0].Id;
        res.json(employee);
    } catch (error) {
        res.status(500).json(error);
    }
});
router.put('/:id', async (req, res) => {
    try {
        if (+req.params.id !== req.body.Id) {
            res.status(400).json({
                message: 'Mismatched identity'
            });
            return;
        }

        const result = await DataAccess.query(`SELECT * FROM Employee WHERE Id = @Id`, [
            { name: 'Id', value: req.params.id }
        ]);

        let employee = result.recordset.length ? result.recordset[0] : null;
        if (employee) {
            await DataAccess.queryEntity(
                `
                    UPDATE Employee SET
                        Code = @Code, 
                        Salary = @Salary, 
                        Job = @Job, 
                        Department = @Department, 
                        Name = @Name
                    WHERE Id = @Id;
                `, req.body
            );

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
        const result = await DataAccess.query(`SELECT * FROM Employee WHERE Id = @Id`, [
            { name: 'Id', value: req.params.id }
        ]);

        let employee = result.recordset.length ? result.recordset[0] : null;
        if (employee) {
            await DataAccess.query(`DELETE FROM Employee WHERE Id = @Id;`, [
                { name: 'Id', value: req.params.id }
            ]);
            res.json({});
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