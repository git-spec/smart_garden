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

module.exports = runQuery;
