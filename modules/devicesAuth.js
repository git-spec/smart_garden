/* ************************************************************ SETUP ******************************************************* */
// modules
const runQuery = require('./mysqlCon');

/* ************************************************************ FUNCTIONS ******************************************************* */
// check Hub Number
function checkHubNum(num) {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM iot_hubs WHERE sn_number LIKE '${num}'`).then(hits => {
            // console.log('devicesAuth: ', hits);
            if (hits.length === 0) {
                reject("not found");
            } else {
                resolve(hits[0]);
            }
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    });
}

/* ************************************************************ EXPORT ******************************************************* */
module.exports = {
    checkHubNum
};
