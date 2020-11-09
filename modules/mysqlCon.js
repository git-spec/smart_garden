const mySql = require('mysql');
let con = null;

function connect() {
    return new Promise((resolve, reject) => {
        if (con) {
            if (con.state === 'disconnected') {
                con.connect(error => {
                    if (error) {
                        reject(error);
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
            con.connect(error => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        }
    });
}

/**
 * Run SQL Query
 * @param {string} queryString 
 */
function runQuery(queryString) {
    return new Promise((resolve, reject) => {
        connect().then(() => {
            con.query(queryString, (error, result, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        }).catch(error => {
            reject(error);
        });
    });
}

/**
 * This function returns the value that was searched for
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
        }).catch(error => {
            reject(error);
        });
    });
}

/**
 * EX: updateRecord("iot_hubs", {connected: 1}, {sn_number: data.sn_number})
 * @param {string} tableName 
 * @param {object} value
 * @param {object} condition 
 */
function updateRecord(tableName, value, condition){
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
        }).catch(error => {
            reject(error);
        });
    });
}

/**
 * 
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
            query += `'${val}', `;
        });
        query = query.substring(0, query.length - 2);
        query += `);`;
        console.log(query);
        runQuery(query).then(result => {
            resolve(result);
        }).catch(error => {
            reject(new Error(error));
        });
    });
}

function twoDigits(d) {
    if (0 <= d && d < 10) return '0' + d.toString();
    if (-10 < d && d < 0) return '-0' + (-1 * d).toString();
    return d.toString();
}

const toMysqlFormat = function () {
    let date = new Date();
    return (
        date.getUTCFullYear() +
        '-' +
        twoDigits(1 + date.getUTCMonth()) +
        '-' +
        twoDigits(date.getUTCDate()) +
        ' ' +
        twoDigits(date.getUTCHours() + 1) +
        ':' +
        twoDigits(date.getUTCMinutes()) +
        ':' +
        twoDigits(date.getUTCSeconds())
    );
};

module.exports = {
    runQuery,
    checkExist,
    updateRecord,
    insertMulti,
    toMysqlFormat
};
