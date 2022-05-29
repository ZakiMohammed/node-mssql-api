const e = require('express');
const express = require('express')
const dataAccess = require('../data-access')

const router = express.Router();

// more Features and Queries
router.get('/Employee/search', async (req, res) => {
    try {
        const result = await dataAccess.execute(`SearchEmployee`, [
            { name: 'Name', value: req.query.name }
        ]);
        const record = result.recordset;

        res.json(record);
    } catch (error) {
        res.status(500).json(error);
    }
});
// IT is EXTRA FEATURE
router.get('/Employee/status', async (req, res) => {
    try {
        const result = await dataAccess.execute(`GetEmployeesStatus`, [], [
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
// IT is EXTRA FEATURE
router.get('/Employee/summary', async (req, res) => {
    try {
        const result = await dataAccess.execute(`GetSalarySummary`);
        const summary = {
            Department: result.recordsets[0],
            Job: result.recordsets[1],
        };

        res.json(summary);
    } catch (error) {
        res.status(500).json(error);
    }
});
// IT is EXTRA FEATURE
router.post('/Employee/many', async (req, res) => {
    try {
        const employees = req.body;
        const employeesTable = dataAccess.generateTable([
            { name: 'Code', type: dataAccess.mssql.TYPES.VarChar(50) },
            { name: 'Name', type: dataAccess.mssql.TYPES.VarChar(50) },
            { name: 'Job', type: dataAccess.mssql.TYPES.VarChar(50) },
            { name: 'Salary', type: dataAccess.mssql.TYPES.Int },
            { name: 'Department', type: dataAccess.mssql.TYPES.VarChar(50) }
        ], employees);

        const result = await dataAccess.execute(`AddEmployees`, [
            { name: 'Employees', value: employeesTable }
        ]);
        const newRecord = result.recordset;
        res.json(newRecord);
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
});


//1- First Attempt of CURD for Dynamic web Service

router.post('/getOne/:id', async (req, res) => {
    try {
        const result = await dataAccess.querySelectById( Table = req.body.Table ,[
            { name: 'Id', value: req.params.id , operator : req.body.operator  }
        ]);
       // console.log(result)
        const response = result.recordset.length ? result.recordset[0] : null;

        if (response) {
            res.json(response);
        } else {
            res.status(404).json({
                message: 'Record not found'
            });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});
//2- second Attempt service-handler orderby ID DESC
router.post('/getAll', async (req, res) => {
    try {
        const result = await dataAccess.querySelectByORDER(req.body.Table, order = req.body.order);
        const response = result.recordset;
        res.json(response);
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
});
// 3rd Attempt post / insert to Table service-handler

///start  new 3
router.post('/AddRecord', async (req, res) => {
    try {
        countConitions = Object.keys(req.body).length-2
        operator = req.body.operator
        let inputs = []
       function Display(number ,arr) { 
                for (let i = 0; i < number ; i++) {
                    arr.push({ name: Object.keys(req.body)[i], value: Object.values(req.body)[i], operator})
                 }
            } 

        Display(countConitions,inputs)
        console.log(inputs)
        // passing input as arrays
        const result = await dataAccess.queryInput(
            req.body.Table,
            inputs
        );

        const record = req.body;
        record.Id = result.recordset[0].Id;
        res.json({message: 'Record Added Successfuly'});
    } catch (error) {
        res.status(500).json(error);
    }
});


// Update  4rth Attempt
router.put('/update/:id', async (req, res) => {
    try {
        if (+req.params.id !== req.body.Id) {
            res.status(400).json({
                message: 'Mismatched identity'
            });
            return;
        }

        const result = await dataAccess.querySelectById( req.body.Table , [
            { name: 'Id', value: req.params.id ,operator : '=' }
        ]);

        let record = result.recordset.length ? result.recordset[0] : null;
        if (record) {
            countConitions = Object.keys(req.body).length-2
            operator = req.body.operator
            let inputs = []
           function Display(number ,arr) { 
                    for (let i = 0; i < number ; i++) {
                        arr.push({ name: Object.keys(req.body)[i], value: Object.values(req.body)[i], operator})
                     }
                } 
    
            Display(countConitions,inputs)
            console.log(inputs)
            await dataAccess.queryUpdate(
                req.body.Table, 
                inputs
            );

            response = { ...record, ...req.body };

            res.json(response);
        } else {
            res.status(404).json({
                message: 'Record not found'
            });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});
// Delete 5th Attempt
router.post('/delete/:id', async (req, res) => {
    try {
        const result = await dataAccess.querySelectById( req.body.Table ,[
            { name: 'Id', value: req.params.id , operator : req.body.operator }
        ]);

        let record = result.recordset.length ? result.recordset[0] : null;
        if (record) {
            await dataAccess.queryDelete(req.body.Table , [
                { name: 'Id', value: req.params.id , operator : req.body.operator  }
            ]);
            res.json({message:'Record Deleted'});
        } else {
            res.status(404).json({
                message: 'Record not found'
            });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});


// Custom Big Query Multi Condition SELECT
router.post('/multiCond', async (req, res) => {
    try {
        
        //console.log(Object.keys(req.body).length-2)
        // mines 1 is because we dont count req.body.Table
        countConitions = Object.keys(req.body).length-2
        operator = req.body.operator
        let inputs = []
       function Display(number ,arr) { 
                for (let i = 0; i < number ; i++) {
                    arr.push({ name: Object.keys(req.body)[i], value: Object.values(req.body)[i], operator})
                 }
            } 

        Display(countConitions,inputs)
        console.log(inputs)
        console.log(inputs.length)

         if (countConitions>=1) {
            const result = await dataAccess.CustomquerySelectById( Table = req.body.Table,inputs );
            const record = result.recordset.length ? result.recordset[0] : null;

                    if (record) {
                        res.json(record);
                    } else {
                        res.status(404).json({
                            message: 'Record not found'
                        });
                    }
            }
            else {
            order = req.body.order
            //default order = DESC
            if(!req.body.order) order ='DESC'

            const result = await dataAccess.querySelectByORDER(req.body.Table, order);
                const response = result.recordset;
                    if (response) {
                        res.json(response);
                    } else {
                        res.status(404).json({
                            message: 'Record not found'
                        });
                    }
            }
    } catch (error) {
        res.status(500).json(error);
    }
});
module.exports = router;