const mssql = require('mssql')

let pool;

const poolConfig = () => ({
    driver: process.env.SQL_DRIVER,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    user: process.env.SQL_UID,
    password: process.env.SQL_PWD,
    options: {
        encrypt: false,
        enableArithAbort: false
    }
});

const fetchParams = entity => {
    const params = [];
    for (const key in entity) {
        if (entity.hasOwnProperty(key)) {
            const value = entity[key];
            params.push({
                name: key,
                value
            });
        }
    }
    return params;
};

const assignParams = (request, inputs, outputs) => {
    [inputs, outputs].forEach((params, index) => {
        const operation = index === 0 ? 'input' : 'output';
        params.forEach(param => {
            if (param.type) {
                request[operation](param.name, param.type, param.value);
            } else {
                request[operation](param.name, param.value);
            }
        });
    });
};

const run = async (name, command, inputs = [], outputs = []) => {
    await connect();
    const request = pool.request();
    assignParams(request, inputs, outputs);
    return request[name](command);
};

const connect = async () => {
    if (!pool) {
        pool = new mssql.ConnectionPool(poolConfig());
    }
    if (!pool.connected) {
        await pool.connect();
    }
};

const query = async (command, inputs = [], outputs = []) => {
    return run('query', command, inputs, outputs);
};

//1-First Attempt data-access.js
const querySelectById = async (Table ,  inputs = [], outputs = []) => {
    command = `SELECT * FROM ${Table} WHERE Id ${inputs[0].operator} @Id`
    return run('query', command, inputs, outputs);
};

//Second Attempt
const querySelectByORDER = async ( Table, order, inputs = [], outputs = []) => {
    command = `SELECT * FROM ${Table} ORDER BY Id ${order}`
    return run('query', command, inputs, outputs);
};
//3d Attempt 
//used , handling Tables in range of coloumns between 1 to 7 
// you can add more else if and handle more Cols
const queryInput = async ( Table , inputs = [], outputs = []) => {
    if(inputs.length ==1){    command = `
    INSERT INTO ${Table} (${inputs[0].name}) 
    OUTPUT inserted.Id 
    VALUES (@${inputs[0].name});
    `}
    else if(inputs.length ==2){    command = `
    INSERT INTO ${Table} (${inputs[0].name}, ${inputs[1].name} ) 
    OUTPUT inserted.Id 
    VALUES (@${inputs[0].name}, @${inputs[1].name});
    `}
    else if(inputs.length ==3){    command = `
    INSERT INTO ${Table} (${inputs[0].name}, ${inputs[1].name}, ${inputs[2].name} ) 
    OUTPUT inserted.Id 
    VALUES (@${inputs[0].name}, @${inputs[1].name}, @${inputs[2].name});
    `}
    else if(inputs.length ==4){    command = `
    INSERT INTO ${Table} (${inputs[0].name}, ${inputs[1].name}, ${inputs[2].name}, ${inputs[3].name} ) 
    OUTPUT inserted.Id 
    VALUES (@${inputs[0].name}, @${inputs[1].name}, @${inputs[2].name}, @${inputs[3].name});
    `}
    else if(inputs.length ==5){    command = `
    INSERT INTO ${Table} (${inputs[0].name}, ${inputs[1].name}, ${inputs[2].name}, ${inputs[3].name}, ${inputs[4].name} ) 
    OUTPUT inserted.Id 
    VALUES (@${inputs[0].name}, @${inputs[1].name}, @${inputs[2].name}, @${inputs[3].name}, @${inputs[4].name});
    `}
    else if(inputs.length ==6){    command = `
    INSERT INTO ${Table} (${inputs[0].name}, ${inputs[1].name}, ${inputs[2].name}, ${inputs[3].name}, ${inputs[4].name}, ${inputs[5].name} ) 
    OUTPUT inserted.Id 
    VALUES (@${inputs[0].name}, @${inputs[1].name}, @${inputs[2].name}, @${inputs[3].name}, @${inputs[4].name} @${inputs[5].name});
    `}
    
    else if(inputs.length ==7){    command = `
    INSERT INTO ${Table} (${inputs[0].name}, ${inputs[1].name}, ${inputs[2].name}, ${inputs[3].name}, ${inputs[4].name}, ${inputs[5].name} ,${inputs[6].name} ) 
    OUTPUT inserted.Id 
    VALUES (@${inputs[0].name}, @${inputs[1].name}, @${inputs[2].name}, @${inputs[3].name}, @${inputs[4].name} @${inputs[5].name},${inputs[6].name});
    `}
    else{
        command = `
        INSERT INTO ${Table} (${inputs[0].name}, ${inputs[1].name}, ${inputs[2].name}, ${inputs[3].name}, ${inputs[4].name} ) 
        OUTPUT inserted.Id 
        VALUES (@${inputs[0].name}, @${inputs[1].name}, @${inputs[2].name}, @${inputs[3].name}, @${inputs[4].name});
        `
    }

    return run('query', command, inputs, outputs);
};


//This code is Used for Update
const queryUpdate = async ( Table ,inputs = [], outputs = []) => {
    if(inputs.length == 2){
        command =    `
        UPDATE ${Table} SET
        ${inputs[1].name} ${inputs[1].operator} @${inputs[1].name} 
        WHERE ${inputs[0].name} ${inputs[0].operator} @${inputs[0].name};
    `
    }
    else if(inputs.length == 3){
        command =    `
        UPDATE ${Table} SET
        ${inputs[1].name} ${inputs[1].operator} @${inputs[1].name}, 
        ${inputs[2].name} ${inputs[2].operator} @${inputs[2].name}
        WHERE ${inputs[0].name} ${inputs[0].operator} @${inputs[0].name};
    `
    }
    else if(inputs.length == 4){
        command =    `
        UPDATE ${Table} SET
        ${inputs[1].name} ${inputs[1].operator} @${inputs[1].name}, 
        ${inputs[2].name} ${inputs[2].operator} @${inputs[2].name}, 
        ${inputs[3].name} ${inputs[3].operator} @${inputs[3].name}
        WHERE ${inputs[0].name} ${inputs[0].operator} @${inputs[0].name};
    `
    }
    else if(inputs.length == 5){
        command =    `
        UPDATE ${Table} SET
        ${inputs[1].name} ${inputs[1].operator} @${inputs[1].name}, 
        ${inputs[2].name} ${inputs[2].operator} @${inputs[2].name}, 
        ${inputs[3].name} ${inputs[3].operator} @${inputs[3].name}, 
        ${inputs[4].name} ${inputs[4].operator} @${inputs[4].name}
        WHERE ${inputs[0].name} ${inputs[0].operator} @${inputs[0].name};
    `
    }
   else if(inputs.length == 6){
        command =    `
        UPDATE ${Table} SET
        ${inputs[1].name} ${inputs[1].operator} @${inputs[1].name}, 
        ${inputs[2].name} ${inputs[2].operator} @${inputs[2].name}, 
        ${inputs[3].name} ${inputs[3].operator} @${inputs[3].name}, 
        ${inputs[4].name} ${inputs[4].operator} @${inputs[4].name}, 
        ${inputs[5].name} ${inputs[5].operator} @${inputs[5].name}
        WHERE ${inputs[0].name} ${inputs[0].operator} @${inputs[0].name};
    `
    }

    else if (inputs.length == 7){
        command =    `
        UPDATE ${Table} SET
        ${inputs[1].name} ${inputs[1].operator} @${inputs[1].name}, 
        ${inputs[2].name} ${inputs[2].operator} @${inputs[2].name}, 
        ${inputs[3].name} ${inputs[3].operator} @${inputs[3].name}, 
        ${inputs[4].name} ${inputs[4].operator} @${inputs[4].name}, 
        ${inputs[5].name} ${inputs[5].operator} @${inputs[5].name},
        ${inputs[6].name} ${inputs[6].operator} @${inputs[6].name}

        WHERE ${inputs[0].name} ${inputs[0].operator} @${inputs[0].name};
    `
    }
    else if (inputs.length == 8){
        command =    `
        UPDATE ${Table} SET
        ${inputs[1].name} ${inputs[1].operator} @${inputs[1].name}, 
        ${inputs[2].name} ${inputs[2].operator} @${inputs[2].name}, 
        ${inputs[3].name} ${inputs[3].operator} @${inputs[3].name}, 
        ${inputs[4].name} ${inputs[4].operator} @${inputs[4].name}, 
        ${inputs[5].name} ${inputs[5].operator} @${inputs[5].name},
        ${inputs[6].name} ${inputs[5].operator} @${inputs[6].name},
        ${inputs[7].name} ${inputs[7].operator} @${inputs[7].name}
        WHERE ${inputs[0].name} ${inputs[0].operator} @${inputs[0].name};
    `
    }
    else {
        command =    `
        UPDATE ${Table} SET
        ${inputs[1].name} ${inputs[1].operator} @${inputs[1].name}, 
        ${inputs[2].name} ${inputs[2].operator} @${inputs[2].name}, 
        ${inputs[3].name} ${inputs[3].operator} @${inputs[3].name}, 
        ${inputs[4].name} ${inputs[4].operator} @${inputs[4].name}, 
        ${inputs[5].name} ${inputs[5].operator} @${inputs[5].name}
        WHERE ${inputs[0].name} ${inputs[0].operator} @${inputs[0].name};
    `}
    return run('query', command, inputs, outputs);
};
//5th Attempt
const queryDelete = async ( Table , inputs = [], outputs = []) => {
    command = `DELETE FROM ${Table} WHERE Id ${inputs[0].operator} @Id;`
    return run('query', command, inputs, outputs);
};
const queryEntity = async (command, entity, outputs = []) => {
    const inputs = fetchParams(entity);
    return run('query', command, inputs, outputs);
};

const execute = async (command, inputs = [], outputs = []) => {
    return run('execute', command, inputs, outputs);
};

const executeEntity = async (command, entity, outputs = []) => {
    const inputs = fetchParams(entity);
    return run('execute', command, inputs, outputs);
};

const generateTable = (columns, entities) => {
    const table = new mssql.Table();

    columns.forEach(column => {
        if (column && typeof column === 'object' && column.name && column.type) {
            if (column.hasOwnProperty('options')) {
                table.columns.add(column.name, column.type, column.options);
            } else {
                table.columns.add(column.name, column.type);
            }
        }
    });

    entities.forEach(entity => {
        table.rows.add(...columns.map(i => entity[i.name]));
    });

    return table;
};

// Multi Condition Query USEING
const CustomquerySelectById = async (Table ,  inputs = [], outputs = []) => {
    console.log(inputs.length)
    //console.log(inputs)
    if(inputs.length == 1){
        command = `SELECT * FROM ${Table} WHERE ${inputs[0].name} ${inputs[0].operator} @${inputs[0].name} `
    }
    if(inputs.length == 2){
        command = `SELECT * FROM ${Table} WHERE ${inputs[0].name} ${inputs[0].operator} @${inputs[0].name} 
        And ${inputs[1].name} ${inputs[1].operator} @${inputs[1].name};`
    }
    else if (inputs.length == 3 ) {
        command = `SELECT * FROM ${Table} WHERE ${inputs[0].name} ${inputs[0].operator} @${inputs[0].name} 
        And ${inputs[1].name} ${inputs[1].operator} @${inputs[1].name}
        And ${inputs[2].name} ${inputs[2].operator} @${inputs[2].name};`
    }
    else if (inputs.length == 4 ) {
        command = `SELECT * FROM ${Table} WHERE ${inputs[0].name} ${inputs[0].operator} @${inputs[0].name} 
        And ${inputs[1].name} ${inputs[1].operator} @${inputs[1].name}
        And ${inputs[2].name} ${inputs[2].operator} @${inputs[2].name}
        And ${inputs[3].name} ${inputs[3].operator} @${inputs[3].name};`
    }
    else if (inputs.length == 5 ) {
        command = `SELECT * FROM ${Table} WHERE ${inputs[0].name} ${inputs[0].operator} @${inputs[0].name} 
        And ${inputs[1].name} ${inputs[1].operator} @${inputs[1].name}
        And ${inputs[2].name} ${inputs[2].operator} @${inputs[2].name}
        And ${inputs[3].name} ${inputs[3].operator} @${inputs[3].name}
        And ${inputs[4].name} ${inputs[4].operator} @${inputs[4].name}
        ;`
    }
    else if (inputs.length == 6 ) {
        command = `SELECT * FROM ${Table} WHERE ${inputs[0].name} ${inputs[0].operator} @${inputs[0].name} 
        And ${inputs[1].name} ${inputs[1].operator} @${inputs[1].name}
        And ${inputs[2].name} ${inputs[2].operator} @${inputs[2].name}
        And ${inputs[3].name} ${inputs[3].operator} @${inputs[3].name}
        And ${inputs[4].name} ${inputs[4].operator} @${inputs[4].name}
        And ${inputs[5].name} ${inputs[5].operator} @${inputs[5].name}
        ;`
    }
    else if (inputs.length == 7 ) {
        command = `SELECT * FROM ${Table} WHERE ${inputs[0].name} ${inputs[0].operator} @${inputs[0].name} 
        And ${inputs[1].name} ${inputs[1].operator} @${inputs[1].name}
        And ${inputs[2].name} ${inputs[2].operator} @${inputs[2].name}
        And ${inputs[3].name} ${inputs[3].operator} @${inputs[3].name}
        And ${inputs[4].name} ${inputs[4].operator} @${inputs[4].name}
        And ${inputs[5].name} ${inputs[5].operator} @${inputs[5].name}
        And ${inputs[6].name} ${inputs[6].operator} @${inputs[6].name}
        ;`
    }

    else {
        command = `SELECT * FROM ${Table} WHERE ${inputs[0].name} ${inputs[0].operator} @${inputs[0].name} `
    }

  console.log(command)

    return run('query', command, inputs, outputs);
};

module.exports = {
    pool,
    mssql,
    connect,
    query,
    querySelectById,
    querySelectByORDER,
    queryInput,
    queryDelete,
    queryUpdate,
    queryEntity,
    execute,
    executeEntity,
    generateTable,
    CustomquerySelectById
};