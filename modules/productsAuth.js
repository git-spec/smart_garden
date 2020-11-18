/* ******************************************************* SETUP ******************************************************* */
// modules
const {runQuery} = require('./mysqlCon');

/* ******************************************************* FUNCTIONS ******************************************************* */
function checkHubNum(hubNum) {
    return new Promise((resolve, reject) => {
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

function addHub(hubName, hubNum, userID) {
    return new Promise((resolve, reject) => {
        runQuery(`UPDATE iot_hubs SET name='${hubName}', user_id=${userID} WHERE sn_number='${hubNum}'`).then(data => {
            getHubs(userID).then(data => {
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

function addDevice(deviceName, deviceNum, hubID, userID) {
    return new Promise((resolve, reject) => {
        runQuery(`UPDATE iot_device SET name='${deviceName}', user_id=${userID}, hub_id=${hubID} WHERE sn_number='${deviceNum}'`).then(data => {
            getDevices(userID).then(data => {
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

function getHubs(userID) {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM iot_hubs WHERE user_id=${userID}`).then(data => {            
            resolve(data);
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    });
}

function getDevices(userID) {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT iot_device.*, device_types.name AS device_name FROM iot_device 
                INNER JOIN device_types ON iot_device.type_id=device_types.id 
                WHERE user_id=${userID}`).then(data => {
                resolve(data);
            }).catch(err => {
                console.log(err);
                reject(err);
            });
    });
}

function deleteHub(hubID, userID) {
    return new Promise((resolve, reject) => {
        runQuery(`UPDATE iot_hubs SET name=null, user_id=null WHERE id='${hubID}'`).then(data => {
            deleteDevices(hubID).then(data => {
                getHubs(userID).then(data => {
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
        runQuery(`UPDATE iot_device SET name=null, user_id=null, hub_id=null WHERE hub_id='${hubID}'`).then(data => {
            resolve(data);
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    });
}

function deleteDevice(deviceID, userID) {
    return new Promise((resolve, reject) => {
        runQuery(`UPDATE iot_device SET name=null, user_id=null, hub_id=null WHERE id='${deviceID}'`).then(data => {            
            getDevices(userID).then(data => {
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

function deviceOnOff(deviceSN, deviceStatus) {
    return new Promise((resolve, reject) => {
        runQuery(`UPDATE iot_device SET status=${deviceStatus} WHERE sn_number='${deviceSN}'`).then(() => {
            resolve();
        }).catch(err => {
            console.log(err); 
            reject(err);
        });
    });
}

function saveRanges(inputRangeTime, inputRangeDuration, deviceSN, soilMoistureDevice) {
    return new Promise((resolve, reject) => {
        runQuery(`UPDATE iot_device SET moisture_device_id=${soilMoistureDevice}, water_time=${inputRangeTime}, water_duration=${inputRangeDuration} WHERE sn_number='${deviceSN}'`).then(() => {
            resolve();
        }).catch(err => {
            console.log(err); 
            reject(err);
        });
    });
}

function deviceMoistureData(deviceID) {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT AVG(CONVERT(REPLACE( REPLACE(data, '"]', ''), '["', ''), signed)) as value, DATE(timestamp) as time FROM iot_data WHERE device_id=${deviceID} AND timestamp >= curdate() - INTERVAL DAYOFWEEK(curdate()) + 6 DAY GROUP BY DATE(timestamp)`).then(data => {
            resolve(data);
        }).catch(err => {
            console.log(err); 
            reject(err);
        });
    });
}

function deviceTempHumData(deviceID) {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT AVG(CONVERT(SUBSTRING_INDEX(REPLACE(REPLACE( REPLACE(data, '"]', ''), '["', ''),'"',''),',',1), signed)) as humidity,AVG(CONVERT(SUBSTRING_INDEX(REPLACE( REPLACE(data, '"]', ''), '["', ''),',"',-1), signed)) as temp, DATE(timestamp) as time FROM iot_data WHERE device_id=${deviceID} AND timestamp >= curdate() - INTERVAL DAYOFWEEK(curdate()) + 6 DAY GROUP BY DATE(timestamp)`).then(data => {
            resolve(data);
        }).catch(err => {
            console.log(err); 
            reject(err);
        });
    });
}

function deviceLightData(deviceID) {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT AVG(CONVERT(REPLACE( REPLACE(data, '"]', ''), '["', ''), signed)) as value, DATE(timestamp) as time FROM iot_data WHERE device_id=${deviceID} AND timestamp >= curdate() - INTERVAL DAYOFWEEK(curdate()) + 6 DAY GROUP BY DATE(timestamp)`).then(data => {
            resolve(data);
        }).catch(err => {
            console.log(err); 
            reject(err);
        });
    });
}

/* ******************************************************* EXPORT ******************************************************* */
module.exports = {
    checkHubNum,
    checkDeviceNum,
    addHub,
    addDevice,
    getHubs,
    getDevices,
    deleteHub,
    deleteDevice,
    deviceOnOff,
    saveRanges,
    deviceMoistureData,
    deviceTempHumData,
    deviceLightData
};
