/* ---------------------------------------- SETUP ---------------------------------------- */
// modules
const runQuery = require('./mysqlCon');

/* ---------------------------------------- FUNCTIONS ---------------------------------------- */
function checkHubNum(hubNum) {
    return new Promise((resolve, reject) => {
        // runQuery(`SELECT * FROM iot_hubs WHERE sn_number LIKE '${hubNum}' AND user_id IS NULL`).then(data => {
        runQuery(`SELECT * FROM iot_hubs WHERE sn_number LIKE '${hubNum}'`).then(data => {
            if (data.length === 0) {
                reject("not found");
            } else if (data[0].user_id !== null) {
                reject("already registered");
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
        // runQuery(`SELECT * FROM iot_device WHERE sn_number LIKE '${deviceNum}' AND user_id IS NULL`).then(data => {
        runQuery(`SELECT * FROM iot_device WHERE sn_number LIKE '${deviceNum}'`).then(data => {
            if (data.length === 0) {
                reject("not found");
            } else if (data[0].user_id !== null) {
                reject("already registered");
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
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    });
}

function addDevice(deviceNum, hubID) {
    return new Promise((resolve, reject) => {
        runQuery(`UPDATE iot_device SET user_id=1, hub_id=${hubID} WHERE sn_number='${deviceNum}'`).then(data => {
            getDevices(hubID).then(data => {
                resolve(data);
            }).catch(err => {
                console.log(err);
                reject(err);
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

function getDevices(hubID) {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT iot_device.*, device_types.name FROM iot_device 
            INNER JOIN device_types ON iot_device.type_id=device_types.id 
            WHERE user_id=1 AND hub_id=${hubID}`).then(data => {            
            resolve(data);
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    });
}

function deleteHub(hubID) {
    return new Promise((resolve, reject) => {
        runQuery(`UPDATE iot_hubs SET user_id=null WHERE id='${hubID}'`).then(data => {
            deleteDevices(hubID).then(data => {
                getHubs().then(data => {
                    resolve(data);
                }).catch(err => {
                    console.log(err);
                    reject(err);
                });
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    });
}

function deleteDevices(hubID) {
    return new Promise((resolve, reject) => {
        runQuery(`UPDATE iot_device SET user_id=null, hub_id=null WHERE hub_id='${hubID}'`).then(data => {
            resolve(data);
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    });
}

function deleteDevice(deviceID, hubID) {
    return new Promise((resolve, reject) => {
        runQuery(`UPDATE iot_device SET user_id=null, hub_id=null WHERE id='${deviceID}'`).then(data => {            
            getDevices(hubID).then(data => {
                resolve(data);
            }).catch(err => {
                console.log(err);
                reject(err);
            });
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
    getDevices,
    deleteHub,
    deleteDevice
};
