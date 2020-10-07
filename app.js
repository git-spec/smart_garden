/* ---------------------------------------- SETUP ---------------------------------------- */
const express = require('express');
const fs = require('fs');
const cors = require('cors')

const app = express();

app.use(express.static(__dirname + '/public/build'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

// modules
const {
    checkHubNum, 
    checkDeviceNum, 
    addHub,
    addDevice, 
    getHubs,
    getDevices
} = require('./modules/devicesAuth');

/* ---------------------------------------- POST ROUTES ---------------------------------------- */
app.post('/checkhubnum', (req, res) => {
    // 1 serialnumber found
    // 2 serialnumber not found
    // 3 server error
    const hubNum = req.body.hubNum.trim();
    if (hubNum) {
        checkHubNum(hubNum).then(data => {
            res.json(1);
        }).catch(err => {
            // console.log(err);
            if (err === "not found") {
                res.json(2);
            } else {
                res.json(3);
            }
        });
    } else {
        res.json(3);
    }
});

app.post('/checkdevicenum', (req, res) => {
    // 1 serialnumber found
    // 2 serialnumber not found
    // 3 server error
    const deviceNum = req.body.deviceNum.trim();
    if (deviceNum) {
        checkDeviceNum(deviceNum).then(data => {
            res.json(1);
        }).catch(err => {
            if (err === "not found") {
                res.json(2);
            } else {
                res.json(3);
            }
        });
    } else {
        res.json(3);
    }
});

app.post('/addhub', (req, res) => {
    // 1 hub successfully registered 
    // 2 server error
    const hubNum = req.body.hubNum.trim();
    if (hubNum) {
        addHub(hubNum).then(data => {
            // console.log(data);
            res.json(data);
        }).catch(err => {
            console.log(err);
            res.json(2);
        });
    } else {
        res.json(2);
    }
});

app.post('/adddevice', (req, res) => {
    // 1 device successfully registered 
    // 2 server error
    const hubID = req.body.hubID;
    const deviceNum = req.body.deviceNum.trim();
    if (hubID && deviceNum) {
        addDevice(hubID, deviceNum).then(data => {
            // console.log(data);
            res.json(data);
        }).catch(err => {
            console.log(err);
            res.json(2);
        });
    } else {
        res.json(2);
    }
});

app.post('/gethubs', (req, res) => {
    // 2 server error
    getHubs().then(data => {
        // console.log(data);
        res.json(data);
    }).catch(err => {
        console.log(err);
        res.json(2);
    });
});

app.post('/getdevices', (req, res) => {
    // 2 server error
    getDevices().then(data => {
        // console.log(data);
        res.json(data);
    }).catch(err => {
        console.log(err);
        res.json(2);
    });
});

/* ---------------------------------------- USE ROUTES ---------------------------------------- */
app.use('/', (req, res) => {
    const html = fs.readFileSync(__dirname + '/public/build/index.html', 'utf-8');
    res.send(html);
});

/* ---------------------------------------- LOCALHOST ---------------------------------------- */
app.listen(port, () => {
    console.log(`App is listening to port: ${port}`);
});
