/* ******************************************************* SETUP ******************************************************* */
const {runQuery} = require('./mysqlCon');

/* ******************************************************* PRODUCT REGISTRATION ******************************************************* */
// checks if an entered serial number of a hub exists and is not already registered
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

// checks if an entered serial number of a device exists and is not already registered
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

// adds the userID and a name to the corresponding hub
function addHub(hubName, hubNum, userID) {
    return new Promise((resolve, reject) => {
        runQuery(`UPDATE iot_hubs SET name='${hubName}', user_id=${userID} WHERE sn_number='${hubNum}'`).then(() => {
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

// adds the userID and a name to the corresponding device
function addDevice(deviceName, deviceNum, hubID, userID) {
    return new Promise((resolve, reject) => {
        runQuery(`UPDATE iot_device SET name='${deviceName}', user_id=${userID}, hub_id=${hubID} WHERE sn_number='${deviceNum}'`).then(() => {
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

/* ******************************************************* GET PRODUCTS ******************************************************* */
// gets all hubs registered by the user
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

// gets all devices registered by the user
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

/* ******************************************************* DELETE PRODUCTS ******************************************************* */
// deletes a specific hub
function deleteHub(hubID, userID) {
    return new Promise((resolve, reject) => {
        runQuery(`UPDATE iot_hubs SET name=null, user_id=null WHERE id='${hubID}'`).then(() => {
            deleteDevices(hubID).then(() => {
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

// deletes a specific device
function deleteDevice(deviceID, userID) {
    return new Promise((resolve, reject) => {
        runQuery(`UPDATE iot_device SET name=null, user_id=null, hub_id=null WHERE id='${deviceID}'`).then(() => {            
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

// deletes all devices belonging to a hub
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

/* ******************************************************* CONTROL WATER PUMP ******************************************************* */
// turns the water pump on or off
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

// stores the settings for controlling the water pump
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

/* ******************************************************* GET SENSOR DATA ******************************************************* */
// get the average values of the last days of the soil moisture device
function deviceMoistureData(deviceID) {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT AVG(CONVERT(REPLACE( REPLACE(data, '"]', ''), '["', ''), signed)) as value, DATE(timestamp) as time FROM iot_data WHERE device_id=${deviceID} AND timestamp >= 20201101 - INTERVAL DAYOFWEEK(curdate()) + 30 DAY GROUP BY DATE(timestamp)`).then(data => {
            resolve(data);
        }).catch(err => {
            console.log(err); 
            reject(err);
        });
    });
}

// get the average values of the last days of the temperature and humidity device
function deviceTempHumData(deviceID) {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT AVG(CONVERT(SUBSTRING_INDEX(REPLACE(REPLACE( REPLACE(data, '"]', ''), '["', ''),'"',''),',',1), signed)) as humidity,AVG(CONVERT(SUBSTRING_INDEX(REPLACE( REPLACE(data, '"]', ''), '["', ''),',"',-1), signed)) as temp, DATE(timestamp) as time FROM iot_data WHERE device_id=${deviceID} AND timestamp >= curdate() - INTERVAL DAYOFWEEK(curdate()) + 30 DAY GROUP BY DATE(timestamp)`).then(data => {
            resolve(data);
        }).catch(err => {
            console.log(err); 
            reject(err);
        });
    });
}

// get the average values of the last days of the light device
function deviceLightData(deviceID) {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT AVG(CONVERT(REPLACE( REPLACE(data, '"]', ''), '["', ''), signed)) as value, DATE(timestamp) as time FROM iot_data WHERE device_id=${deviceID} AND timestamp >= curdate() - INTERVAL DAYOFWEEK(curdate()) + 30 DAY GROUP BY DATE(timestamp)`).then(data => {
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
