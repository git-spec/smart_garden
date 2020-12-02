/* ---------------------------------------- SETUP ---------------------------------------- */
// express
const express = require('express');
const userRouter = express.Router();

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

/* ---------------------------------------- ROUTES ---------------------------------------- */
// check if there is a valid session, all user routes have to pass this middleware 
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

userRouter.post('/checkhubnum', (req, res) => {
    // 1 serialnumber found
    // 2 server error
    // 3 serialnumber not found
    // 4 serialnumber already registered
    const hubNum = req.body.hubNum.trim();
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

userRouter.post('/checkdevicenum', (req, res) => {
    // 1 serialnumber found
    // 2 server error
    // 3 serialnumber not found
    // 4 serialnumber already registered
    const deviceNum = req.body.deviceNum.trim();
    if (deviceNum) {
        checkDeviceNum(deviceNum).then(data => {
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

userRouter.post('/addhub', (req, res) => {
    // data: updated hubs
    // 2 server error
    const hubName = req.body.hubName.trim();
    const hubNum = req.body.hubNum.trim();
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

userRouter.post('/adddevice', (req, res) => {
    // data: updated devices
    // 2 server error
    const deviceName = req.body.deviceName.trim();
    const deviceNum = req.body.deviceNum.trim();
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

userRouter.post('/gethubs', (req, res) => {
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

userRouter.post('/getdevices', (req, res) => {
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

userRouter.post('/deviceonoff', (req, res) => {
    // 1 status (on/off) of the waterpump device has changed successfully
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

userRouter.post('/saveranges', (req, res) => {
    // 1 ranges for waterpump device were saved successfully
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

userRouter.post('/devicemoisturedata', (req, res) => {
    // data: received data from the database for soil moisture device
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

userRouter.post('/devicetemphumdata', (req, res) => {
    // data: received data from the database for temperature & humidity device
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

userRouter.post('/devicelightdata', (req, res) => {
    // data: received data from the database for light device
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

userRouter.post('/logout', (req, res) => {
    req.session.destroy(); // destroys session & logs user out
    res.json(10);
});

/* ---------------------------------------- EXPORT ---------------------------------------- */
module.exports = userRouter;