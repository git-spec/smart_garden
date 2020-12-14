/* ******************************************************* SETUP ******************************************************* */
// express
const express = require('express');
const userRouter = express.Router();
// packages
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
// database functions
const {
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
} = require('../modules/productsAuth');

/* ******************************************************* GUARD ******************************************************* */
// checks if there is a valid user session, all user routes must pass this middleware before letting the user in
userRouter.use((req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        switch (req.method.toUpperCase()) {
            case 'GET':
                res.redirect('/login');
                break;
            case 'POST':
                res.json(10);
                break;
            default:
                res.json('nothing to show');
                break;
        }
    }
});

/* ******************************************************* PRODUCT REGISTRATION ******************************************************* */
// checks if an entered serial number of a hub exists and is not already registered
userRouter.post('/checkhubnum', (req, res) => {
    // 1 serialnumber found
    // 2 server error
    // 3 serialnumber not found
    // 4 serialnumber already registered
    const hubNum = entities.encode(req.body.hubNum.trim());
    if (hubNum) {
        checkHubNum(hubNum).then(() => {
            res.json(1);
        }).catch(err => {
            if (err === "not found") {
                res.json(3);
            } else if (err === "already registered") {
                res.json(4);
            } else {
                res.json(2);
            }
        });
    } else {
        res.json(2);
    }
});

// checks if an entered serial number of a device exists and is not already registered
userRouter.post('/checkdevicenum', (req, res) => {
    // 1 serialnumber found
    // 2 server error
    // 3 serialnumber not found
    // 4 serialnumber already registered
    const deviceNum = entities.encode(req.body.deviceNum.trim());
    if (deviceNum) {
        checkDeviceNum(deviceNum).then(() => {
            res.json(1);
        }).catch(err => {
            if (err === "not found") {
                res.json(3);
            } else if (err === "already registered") {
                res.json(4);
            } else {
                res.json(2);
            }
        });
    } else {
        res.json(2);
    }
});

// adds the userID and a name to the corresponding hub
userRouter.post('/addhub', (req, res) => {
    // data: updated hubs
    // 2 server error
    const hubName = entities.encode(req.body.hubName.trim());
    const hubNum = entities.encode(req.body.hubNum.trim());
    const userID = req.session.user.id;
    if (hubName && hubNum && userID) {
        addHub(hubName, hubNum, userID).then(data => {
            res.json(data);
        }).catch(err => {
            console.log(err);
            res.json(2);
        });
    } else {
        res.json(2);
    }
});

// adds the userID and a name to the corresponding device
userRouter.post('/adddevice', (req, res) => {
    // data: updated devices
    // 2 server error
    const deviceName = entities.encode(req.body.deviceName.trim());
    const deviceNum = entities.encode(req.body.deviceNum.trim());
    const hubID = req.body.hubID;
    const userID = req.session.user.id;
    if (deviceName && deviceNum && hubID && userID) {
        addDevice(deviceName, deviceNum, hubID, userID).then(data => {
            res.json(data);
        }).catch(err => {
            console.log(err);
            res.json(2);
        });
    } else {
        res.json(2);
    }
});

/* ******************************************************* GET PRODUCTS ******************************************************* */
// gets all hubs registered by the user
userRouter.post('/gethubs', (req, res) => {
    // data: all hubs registered by the user
    // 2 server error
    const userID = req.session.user.id;
    if (userID) {
        getHubs(userID).then(data => {
            res.json(data);
        }).catch(err => {
            console.log(err);
            res.json(2);
        });
    } else {
        res.json(2);
    }
});

// gets all devices registered by the user
userRouter.post('/getdevices', (req, res) => {
    // data: all devices registered by the user
    // 2 server error
    const userID = req.session.user.id;
    if (userID) {
        getDevices(userID).then(data => {
            res.json(data);
        }).catch(err => {
            console.log(err);
            res.json(2);
        });
    } else {
        res.json(2);
    }
});

/* ******************************************************* DELETE PRODUCTS ******************************************************* */
// deletes a specific hub
userRouter.post('/deletehub', (req, res) => {
    // data: updated hubs
    // 2 server error
    const hubID = req.body.hubID;
    const userID = req.session.user.id;
    if (hubID && userID) {
        deleteHub(hubID, userID).then(data => {
            res.json(data);
        }).catch(err => {
            console.log(err);
            res.json(2);
        });
    } else {
        res.json(2);
    }
});

// deletes a specific device
userRouter.post('/deletedevice', (req, res) => {
    // data: updated devices
    // 2 server error
    const deviceID = req.body.deviceID;
    const userID = req.session.user.id;
    if (deviceID && userID) {
        deleteDevice(deviceID, userID).then(data => {
            res.json(data);
        }).catch(err => {
            console.log(err);
            res.json(2);
        });
    } else {
        res.json(2);
    }
});

/* ******************************************************* CONTROL WATER PUMP ******************************************************* */
// turns the water pump on or off
userRouter.post('/deviceonoff', (req, res) => {
    // 1 status (on/off) of the water pump device has changed successfully
    const deviceSN = req.body.deviceSN;
    const deviceStatus = req.body.deviceStatus;
    if (deviceSN && deviceStatus !== null) {
        deviceOnOff(deviceSN, deviceStatus).then(() => {
            res.json(1);
        }).catch(err => {
            console.log(err);
        });
    } else {
        console.log(err);
    }
});

// stores the settings for controlling the water pump
userRouter.post('/saveranges', (req, res) => {
    // 1 new values for the water pump were saved successfully
    const inputRangeTime = req.body.inputRangeTime;
    const inputRangeDuration = req.body.inputRangeDuration;
    const deviceSn = req.body.deviceSn;
    const soilMoistureDevice = req.body.soilMoistureDevice;
    if (inputRangeTime && inputRangeDuration && deviceSn && soilMoistureDevice) {
        saveRanges(inputRangeTime, inputRangeDuration, deviceSn, soilMoistureDevice).then(() => {
            res.json(1);
        }).catch(err => {
            console.log(err);
        });
    } else {
        console.log(err);
    }
});

/* ******************************************************* GET SENSOR DATA ******************************************************* */
// get the average values of the last days of the soil moisture device
userRouter.post('/devicemoisturedata', (req, res) => {
    // data: received data for the soil moisture device
    const deviceID = req.body.deviceID;
    if (deviceID) {
        deviceMoistureData(deviceID).then(data => {
            res.json(data);
        }).catch(err => {
            console.log(err);
        });
    } else {
        console.log(err);
    }
});

// get the average values of the last days of the temperature and humidity device
userRouter.post('/devicetemphumdata', (req, res) => {
    // data: received data for the temperature & humidity device
    const deviceID = req.body.deviceID;
    if (deviceID) {
        deviceTempHumData(deviceID).then(data => {
            res.json(data);
        }).catch(err => {
            console.log(err);
        });
    } else {
        console.log(err);
    }
});

// get the average values of the last days of the light device
userRouter.post('/devicelightdata', (req, res) => {
    // data: received data for the light device
    const deviceID = req.body.deviceID;
    if (deviceID) {
        deviceLightData(deviceID).then(data => {
            res.json(data);
        }).catch(err => {
            console.log(err);
        });
    } else {
        console.log(err);
    }
});

/* ******************************************************* LOGOUT ******************************************************* */
// destroys the session & logs the user out
userRouter.post('/logout', (req, res) => {
    req.session.destroy();
    res.json(10);
});

/* ******************************************************* EXPORT ******************************************************* */
module.exports = userRouter;