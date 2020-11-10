/* ********************************************************* SETUP ********************************************************* */
// express
const express = require('express');
const app = express();

// packages
const fs = require('fs');
const fileUpload = require('express-fileupload');
app.use(fileUpload({
    limits: {fileSize: 6 * 1024 * 1024},
}))
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
const cors = require('cors');
const session = require('express-session');

// app use
app.use(express.static(__dirname + '/public/build'));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(session({
    secret: 'smart_garden',
    resave: true,
    saveUninitialized: true,
    cookie: {
        path: '/', 
        httpOnly: true, 
        secure: false, 
        maxAge: null
    }
}));

// modules
const SQL = require('./modules/mysqlCon');
const {
    registerUser, 
    editUser, 
    checkUser, 
    verifyUser, 
    confirmVerifiedUser, 
    sendResetLink, 
    resetPass,
    getAllUsers,
    getUser,
    changeVerificationPost,
    tellUserAboutAccountState,
    deleteUser,
    changeUserRole,
} = require('./modules/usersAuth');

// user router
const userRoutes = require('./routes/userRoutes');

// port
const port = process.env.PORT || 5000;

// destructering
const {log} = require("console");

/* ********************************************************* POST ROUTES ********************************************************* */
// register
app.post('/register', (req, res) => {
    // 1 user registered successfully
    // 2 data error
    // 3 user exists
    // 4 server error
    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const userName = req.body.userName.trim();
    const email = req.body.email.trim();
    const password = req.body.password;
    const repassword = req.body.repassword;
    if (firstName && lastName && userName && email && password && password == repassword){
        registerUser(entities.encode(firstName), entities.encode(lastName), entities.encode(userName), entities.encode(email), password).then(() => {
            res.json(1);
        }).catch(error => {
            if (error == "exist") {
                res.json(3);
            } else{
                res.json(4);
            }
        })
    } else {
        res.json(2);
    };
});

// edit
app.post('/edit', (req, res) => {
    // 1 user edited successfully
    // 2 data error
    // 3 user exists
    // 4 server error
 
    const id = req.body.id;
    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const userName = req.body.userName.trim();
    const city = req.body.city;
    const password = req.body.password;
    if ( req.files) {
        const userImg = req.files.userImg;
        if (id && firstName && lastName && userName ) {
            editUser(id, entities.encode(firstName), entities.encode(lastName), entities.encode(userName), entities.encode(city), password, userImg).then(() => {
                res.json(1);
            }).catch(error => {
                if (error == "exist") {
                    res.json(3);
                } else{
                    res.json(4);
                }
            })
        } else {
            res.json(2);
        };
    }else{

        if (id && firstName && lastName && userName ) {
            editUser(id, entities.encode(firstName), entities.encode(lastName), entities.encode(userName), entities.encode(city), password).then(() => {
                res.json(1);
            }).catch(error => {
                if (error == "exist") {
                    res.json(3);
                } else{
                    res.json(4);
                }
            })
        } else {
            res.json(2);
        };
    }

});

// login
app.post('/login', (req, res) => {
    // 1 login successful
    // 2 server error
    // 3 password is wrong
    // 4 user does not exist
    if (req.body.email && req.body.password) {
        checkUser(entities.encode(req.body.email.trim()), req.body.password).then(user => {
            req.session.user = user;
            // res.json({result: 1, id: user.id})
            res.json({email: user.email, id: user.id, userName: user.username, firstName: user.firstname, lastName: user.lastname, role: user.role});
        }).catch(error => {
            if (error == 3) {
                // res.json({result: 3})
                res.json(3);
            } else {
                // res.json({result: 4})
                res.json(4);
            };
        })
    } else {
        // res.json({result: 2})
        res.json(2);
    };
});

// verify user
app.post('/verification', (req, res) => {
    // user updated successfully to verified 
    // 2 server error
    verifyUser(req.body.email).then(() => {
        // confirm the user with email 
        // 1 email successfully sent
        // 2 email NOT sent
        confirmVerifiedUser(req.body.email).then(() => {
            res.json(1);
        }).catch(err => {
            res.json(2);
        });
    }).catch(err => {
        res.json(2)
    });
});

// reset user pass page
app.post('/sendResetLink', (req, res) => {
    // 1 email successfully sent
    // 2 server error
    // 4 user does not exist
    sendResetLink(req.body.email).then(() => {
        res.json(1);
    }).catch(err => {
        if (err == 4) {
            res.json(4)
        } else {
            res.json(2)
        }
    });
});

// reset user pass query
app.post('/resetPass', (req, res) => {
    // 1 sending success
    // 2 server error
    // 4 user does not exist
    resetPass(req.body.email, req.body.id, req.body.pass).then(() => {
        res.json(1);
    }).catch(err => {
        if (err == 4) {
            res.json(4);
        } else {
            res.json(2);
        }
    });
});

// checklogin
app.post('/checklogin', (req, res) => {
    // // just for development, delete for production!!!
    // req.session.user = {
    //     id: 3,
    //     firstname: 'Felix',
    //     lastname: 'Wurst',
    //     username: 'felix',
    //     email: 'felix.wurst@gmail.com',
    //     password: 'sha1$8212f6a2$1$0714d58be01c48e54a40320817e6dfbdf53af8da',
    //     verified: 1
    // };
    // console.log(req.session.user);
    
    // 10 session does not exist
    if (req.session.user) {
        const user = req.session.user;
        res.json({email: user.email, id: user.id, userName: user.username, firstName: user.firstname, lastName: user.lastname});
    } else {
        res.json(10);
    }
});


// get All Users
app.post('/getAllUsers', (req, res) => {
    // 1 sending success
    // 2 no users founded
    getAllUsers().then((users) => {
        res.json(users);
    }).catch(err => {
        if (err == 2) {
            res.json(2);
        } else {
            res.json(err);
        }
    });
});

// get User for Edit page 
app.post('/getuser', (req, res) => {
    // 1 sending success
    // 2 no users founded
    getUser(req.body.id).then(user => {
        res.json(user);
    }).catch(err => {
        if (err == 2) {
            res.json(2);
        } else {
            res.json(err);
        }
    });
});

// change Verification for a user
app.post('/changeVerificationPost', (req, res) => {
    if (req.body.verified) {
        changeVerificationPost(req.body.id).then(() => {
            // confirm the user with email 
            // 1 email successfully sent
            // 2 email NOT sent
            tellUserAboutAccountState(req.body.email).then(() => {
                // tell the user that his account is blocked and he have to speak with the admin
                res.json(1);
            }).catch(err => {
                res.json(2);
            });
        }).catch(err => {
            res.json(2)
        });
    }else{
        changeVerificationPost(req.body.id).then(() => {
           res.json(1)
        }).catch(err => {
            res.json(2)
        });
    }
});

// Delete user Account 
app.post('/deleteUserPost', (req, res) => {
    // 1 mean deleting is success
    // 2 mean deleting is not success
    deleteUser(req.body.id).then(() => {
        res.json(1)
    }).catch(err => {
        res.json(2)
    });
});


//Change user Role 
app.post('/changeUserRolePost', (req, res) => {
    // console.log('body id is '+req.body.id ,'body role is '+req.body.role );
    changeUserRole(req.body.id, req.body.role).then(() => {
        res.json(1)
    }).catch(err => {
        res.json(2)
    });
});
/* ********************************************************* USE ROUTES ********************************************************* */
app.use('/user', userRoutes);

app.use('/', (req, res) => {
    const html = fs.readFileSync(__dirname + '/public/build/index.html', 'utf-8');
    res.send(html);
});

/* ********************************************************* LOCALHOST ********************************************************* */
const server = app.listen(port, () => {
    console.log(`App is listening to port: ${port}`);
});

/* ********************************************************* SOCKET.IO ********************************************************* */
// configure the socket
const io = require('socket.io').listen(server);

io.on('connection', socket => {
    // log('Device Is Connected');

    socket.on('user_connect', userID => {
        // console.log('userID: ', userID);
        socket.join(userID.toString());
    });

    socket.on('hub_connect', data => {
        // check in the database if the hub exists
        SQL.checkExist('iot_hubs', '*', {sn_number: data.sn_number}).then(hubs => {
            // console.log('hub: ', hubs[0]);
            if (hubs.length > 0) {
                if (hubs[0].user_id) {
                    // join user twice?
                    socket.join(hubs[0].user_id);

                    // change the status from hub to connected in db
                    SQL.updateRecord("iot_hubs", {connected: 1}, {sn_number: data.sn_number}).then(() => {
                        socket.broadcast.to(hubs[0].user_id).emit('hub_connect', data.sn_number)
                        log(`Hub ${hubs[0].name} is connected now!`);
                        // get the devices that belong to this hub
                        SQL.checkExist('iot_device', '*', {hub_id: hubs[0].id}).then(devices => {
                            // log(devices);
                            socket.emit('toDevice', devices);
                        }).catch(error => {
                            log(error);
                        });
                    }).catch(error => {
                        log(error);
                    });

                    // listening to info from raspberry
                    socket.on('device_connect', sn_number => {
                        // change the status from device to connected in DB
                        SQL.updateRecord('iot_device', {connected: 1}, {sn_number: sn_number}).then(() => {
                            socket.broadcast.to(hubs[0].user_id).emit('device_connect', sn_number);
                            log(`Device "${sn_number}" is connected now`);
                        }).catch(error => {
                            log(error);
                        });
                    });

                    // listening to info from raspberry
                    socket.on('device_disconnect', sn_number => {
                        // change the status from device to disconnected in DB
                        SQL.updateRecord('iot_device', {connected: 0}, {sn_number: sn_number}).then(() => {
                            socket.broadcast.to(hubs[0].user_id).emit('device_disconnect', sn_number);
                            log(`Device "${sn_number}" is disconnected now`);
                        }).catch(error => {
                            log(error);
                        });
                    });
                    
                    // disconnect hub
                    socket.on('disconnect', () => {
                        // change the status from hub to disconnected in DB
                        SQL.updateRecord("iot_hubs", {connected: 0}, {sn_number: data.sn_number}).then(() => {
                            socket.broadcast.to(hubs[0].user_id).emit('hub_disconnect', data.sn_number);
                            log(`Hub "${hubs[0].name}" is disconnected now`);                        
                        }).catch(error => {
                            log(error);
                        });
                    });
                } else {
                    // hub is not registered
                    log(`Hub ${data.sn_number} is not registered!`);
                    // kill socket
                }
            } else {
                // hub not found
                log(`Hub with ${data.sn_number} is not existing!`);
                // kill socket
            }
        }).catch(error => {
            log(error);
        });
    });

    socket.on('disconnect', () => {
        // log('Hub is disconnected');
    });

});
