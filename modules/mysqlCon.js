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
 * EX: checkExist("tableName", "*", {sn_number: 444, id: 20})
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
            query = query.substring(0, query.length - 4) + ';';
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
 *  updateRecord("iot_hubs", {connected: true, name:"Raspi1"}, {id: 21, user_id:20}")
 * @param {string} tableName 
 * @param {object} values 
 * @param {object} condition 
 */
function updateRecord(tableName, values, condition){

}

module.exports = {
    runQuery,
    checkExist
};
