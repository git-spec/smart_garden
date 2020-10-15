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
    deleteDevice
} = require('../modules/productsAuth');

/* ---------------------------------------- ROUTES ---------------------------------------- */

// check if there is a valid session, all user routes have to pass this middleware 
userRouter.use((req, res, next) => {
    // console.log(req.session.user)
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
        checkHubNum(hubNum).then(data => {
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
            res.json(2);
        });
    } else {
        res.json(2);
    }
});

userRouter.post('/getdevices', (req, res) => {
    // 2 server error
    // const hubID = req.body.hubID;
    const userID = req.session.user.id;
    if (userID) {
        getDevices(userID).then(data => {
            res.json(data);
        }).catch(err => {
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
            res.json(2);
        });
    } else {
        res.json(2);
    }
});

/* ---------------------------------------- EXPORT ---------------------------------------- */
module.exports = userRouter;