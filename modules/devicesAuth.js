/* ---------------------------------------- SETUP ---------------------------------------- */
// modules
const runQuery = require('./mysqlCon');

/* ---------------------------------------- FUNCTIONS ---------------------------------------- */
function checkHubNum(hubNum) {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM iot_hubs WHERE sn_number LIKE '${hubNum}' AND user_id IS NULL`).then(data => {
            if (data.length === 0) {
                reject("not found");
            } else {
                resolve(data[0]);
            }
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    });
}

function checkDeviceNum(deviceNum) {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM iot_device WHERE sn_number LIKE '${deviceNum}' AND user_id IS NULL`).then(data => {
            if (data.length === 0) {
                reject("not found");
            } else {
                resolve(data[0]);
            }
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    });
}

function addHub(hubNum) {
    return new Promise((resolve, reject) => {
        runQuery(`UPDATE iot_hubs SET user_id=1 WHERE sn_number='${hubNum}'`).then(data => {            
            getHubs().then(data => {
                resolve(data);
            }).catch(error => {
                reject(error);
            });
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    });
}

function addDevice(hubID, deviceNum) {
    return new Promise((resolve, reject) => {
        runQuery(`UPDATE iot_device SET user_id=1, hub_id=${hubID} WHERE sn_number='${deviceNum}'`).then(data => {
            // console.log('devicesAuth: ', data);
            // resolve();
            getDevices().then(data => {
                resolve(data);
            }).catch(error => {
                reject(error);
            });
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    });
}

function getHubs() {
    return new Promise((resolve, reject) => {
        runQuery('SELECT * FROM iot_hubs WHERE user_id=1').then(data => {            
            resolve(data);
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    });
}

function getDevices() {
    return new Promise((resolve, reject) => {
        runQuery('SELECT * FROM iot_device WHERE user_id=1').then(data => {            
            resolve(data);
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    });
}

/* ---------------------------------------- EXPORT ---------------------------------------- */
module.exports = {
    checkHubNum,
    checkDeviceNum,
    addHub,
    addDevice,
    getHubs,
    getDevices
};
