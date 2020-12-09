/* ******************************************************* SETUP ******************************************************* */
const mySql = require('mysql');
let con = null;

/* ******************************************************* FUNCTIONS ******************************************************* */
// establishes a connection to the database
function connect() {
    return new Promise((resolve, reject) => {
        if (con) {
            if (con.state === 'disconnected') {
                con.connect(err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        } else {
            con = mySql.createConnection({
                multipleStatements: false,
                host: 'localhost',
                port: 3306,
                user: 'root',
                password: '12345678',
                database: 'smart_garden'
            });
            con.connect(err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        }
    });
}

/**
 * runs a sql query
 * @param {string} queryString 
 */
function runQuery(queryString) {
    return new Promise((resolve, reject) => {
        connect().then(() => {
            con.query(queryString, (err, result, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        }).catch(err => {
            reject(err);
        });
    });
}

/**
 * checks if a certain value exists in a table
 * EX: checkExist('iot_hubs', '*', {sn_number: data.sn_number})
 * @param {string} tableName 
 * @param {string} value EX: * for all rows
 * @param {object} condition EX: {col_name: value}
 */
function checkExist(tableName, value, condition) {
    return new Promise((resolve, reject) => {
        let query = `SELECT ${value} FROM ${tableName}`;
        if (condition) {
            query += ' WHERE ';
            Object.keys(condition).forEach(key => {
                if (typeof condition[`${key}`] === 'number') {
                    query += `${key} = ${condition[`${key}`]} AND `;
                } else {
                    query += `${key} = '${condition[`${key}`]}' AND `;
                }
            });
            query = query.substring(0, query.length - 5) + ';';
        } else {
            query += ';';
        }
        runQuery(query).then(data => {
            if (data.length > 0) {
                resolve(data);
            } else {
                reject('No Data Found');
            }
        }).catch(err => {
            reject(err);
        });
    });
}

/**
 * accesses a certain value in a table, which is then changed
 * EX: updateRecord("iot_hubs", {connected: 1}, {sn_number: data.sn_number})
 * @param {string} tableName 
 * @param {object} value
 * @param {object} condition 
 */
function updateRecord(tableName, value, condition) {
    return new Promise((resolve, reject) => {
        let query = `UPDATE ${tableName}`;
        if (value) {
            query += ' SET ';
            Object.keys(value).forEach(key => {
                if (typeof value[`${key}`] === 'number') {
                    query += `${key} = ${value[`${key}`]} AND `;
                } else {
                    query += `${key} = '${value[`${key}`]}' AND `;
                }
            });
            query = query.substring(0, query.length - 5);
        }
        if (condition) {
            query += ' WHERE ';
            Object.keys(condition).forEach(key => {
                if (typeof condition[`${key}`] === 'number') {
                    query += `${key} = ${condition[`${key}`]} AND `;
                } else {
                    query += `${key} = '${condition[`${key}`]}' AND `;
                }
            });
            query = query.substring(0, query.length - 5);
        }
        query += ';';
        runQuery(query).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

/**
 * inserts several values in a table
 * @param {String} tableName 
 * @param {Array} columns  
 * @param {Array} values 
 * @returns {Object} inserted records
 */
function insertMulti(tableName, columns, values) {
    return new Promise((resolve, reject) => {
        let query = `INSERT INTO ${tableName} (`;
        columns.forEach(col => {
            query += `${col}, `;
        });
        query = query.substring(0, query.length - 2);
        query += `) VALUES (`;
        values.forEach(val => {
            if (val === 'now()') {
                query += `${val}, `;
            } else {
                query += `'${val}', `;
            }
        });
        query = query.substring(0, query.length - 2);
        query += `);`;
        runQuery(query).then(result => {
            resolve(result);
        }).catch(err => {
            reject(new Error(err));
        });
    });
}

/* ******************************************************* EXPORT ******************************************************* */
module.exports = {
    runQuery,
    checkExist,
    updateRecord,
    insertMulti
};
