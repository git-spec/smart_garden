/* ---------------------------------------- SETUP ---------------------------------------- */
const express = require('express');
const fs = require('fs');
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
const cors = require('cors')

const app = express();

app.use(express.static(__dirname + '/public/build'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

// modules
const {registerUser, checkUser, verifyUser} = require('./modules/usersAuth')
const {
    checkHubNum, 
    checkDeviceNum, 
    addHub,
    addDevice, 
    getHubs,
    getDevices,
    deleteHub,
    deleteDevice
} = require('./modules/devicesAuth');

/* ---------------------------------------- POST ROUTES ---------------------------------------- */

app.post('/register', (req, res) => {
    // your post register handler here
    // console.log(req.body)
    // 2 data error
    // 1 user registered successfully
    // 3 user is exist
    // 4 server error
    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const userName = req.body.userName.trim();
    const email = req.body.email.trim();
    const password = req.body.password;
    const repassword = req.body.repassword;
    if (firstName && lastName && userName && email && password && password == repassword){
        registerUser(entities.encode(firstName), entities.encode(lastName), entities.encode(userName), entities.encode(email), password).then(() => {
            res.json(1)
        }).catch(error => {
            console.log(error);
            if (error == "exist") {
                res.json(3)
            } else {
                res.json(4)
            }
        })
    } else {
        res.json(2)
    };
});

app.post('/login', (req, res) => {
    // 1 login success
    // 2 serverError
    // 3 password is wrong
    // 4 user not exist
    if (req.body.email && req.body.password) {
        checkUser(entities.encode(req.body.email.trim()), req.body.password).then(user => {
            // req.session.user = user
            res.json(1)
        }).catch(error => {
            console.log(error);
            if (error == 3) {
                res.json(3)
            } else {
                res.json(4)
            };
        })
    } else {
        res.json(2)
    };
});

// verify user
app.post('/verification', (req, res) => {
    verifyUser(req.body.email).then(() => {
        res.json(1);
    }).catch(err => {
        res.json(2)
      console.log(err);
    });
  });

app.post('/checkhubnum', (req, res) => {
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

app.post('/checkdevicenum', (req, res) => {
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

app.post('/addhub', (req, res) => {
    // data: updated hubs
    // 2 server error
    const hubNum = req.body.hubNum.trim();
    if (hubNum) {
        addHub(hubNum).then(data => {
            res.json(data);
        }).catch(err => {
            res.json(2);
        });
    } else {
        res.json(2);
    }
});

app.post('/adddevice', (req, res) => {
    // data: updated devices
    // 2 server error
    const deviceNum = req.body.deviceNum.trim();
    const hubID = req.body.hubID;
    if (deviceNum && hubID) {
        addDevice(deviceNum, hubID).then(data => {
            res.json(data);
        }).catch(err => {
            res.json(2);
        });
    } else {
        res.json(2);
    }
});

app.post('/gethubs', (req, res) => {
    // 2 server error
    getHubs().then(data => {
        res.json(data);
    }).catch(err => {
        res.json(2);
    });
});

app.post('/getdevices', (req, res) => {
    // 2 server error
    const hubID = req.body.hubID;
    if (hubID) {
        getDevices(hubID).then(data => {
            res.json(data);
        }).catch(err => {
            res.json(2);
        });
    } else {
        res.json(2);
    }
});

app.post('/deletehub', (req, res) => {
    // data: updated hubs
    // 2 server error
    const hubID = req.body.hubID;
    if (hubID) {
        deleteHub(hubID).then(data => {
            res.json(data);
        }).catch(err => {
            res.json(2);
        });
    } else {
        res.json(2);
    }
});

app.post('/deletedevice', (req, res) => {
    // data: updated devices
    // 2 server error
    const deviceID = req.body.deviceID;
    const hubID = req.body.hubID;
    if (deviceID && hubID) {
        deleteDevice(deviceID, hubID).then(data => {
            res.json(data);
        }).catch(err => {
            res.json(2);
        });
    } else {
        res.json(2);
    }
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
