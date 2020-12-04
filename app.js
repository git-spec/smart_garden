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
    changeVerification,
    blockAccount,
    deleteUser,
    changeUserRole,
    sendMessage
} = require('./modules/usersAuth');

// user router
const userRoutes = require('./routes/userRoutes');

// port
const port = process.env.PORT || 5000;

// destructering
const {log} = require("console");

/* ********************************************************* POST ROUTES ********************************************************* */
// register user
app.post('/register', (req, res) => {
    // 1 user registered successfully
    // 2 server error
    // 3 user already exists
    const firstName = entities.encode(req.body.firstName.trim());
    const lastName = entities.encode(req.body.lastName.trim());
    const userName = entities.encode(req.body.userName.trim());
    const email = entities.encode(req.body.email.trim());
    const password = req.body.password;
    const repassword = req.body.repassword;
    if (firstName && lastName && userName && email && password && password === repassword){
        registerUser(firstName, lastName, userName, email, password).then(() => {
            res.json(1);
        }).catch(err => {
            if (err === "exist") {
                res.json(3);
            } else{
                res.json(2);
            }
        })
    } else {
        res.json(2);
    };
});

// login user
app.post('/login', (req, res) => {
    // user: user logged in successfully
    // 2 server error
    // 3 password is wrong
    // 4 user does not exist
    const email = entities.encode(req.body.email.trim());
    const password = req.body.password;
    if (email && password) {
        checkUser(email, password).then(user => {
            req.session.user = user;
            res.json({email: user.email, id: user.id, userName: user.username, firstName: user.firstname, lastName: user.lastname, role: user.role, img: user.img});
        }).catch(err => {
            if (err === 3) {
                res.json(3);
            } else {
                res.json(4);
            };
        })
    } else {
        res.json(2);
    };
});

// check if user is logged in
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
    // 10 session does not exist
    if (req.session.user) {
        const user = req.session.user;
        res.json({email: user.email, id: user.id, userName: user.username, firstName: user.firstname, lastName: user.lastname, img: user.img, role: user.role});
    } else {
        res.json(10);
    }
});

// verify user
app.post('/verifyuser', (req, res) => {
    // 1 user updated successfully to verified 
    // 2 server error
    verifyUser(req.body.email).then(() => {
        confirmVerifiedUser(req.body.email).then(() => {
            res.json(1);
        }).catch(() => {
            res.json(2);
        });
    }).catch(() => {
        res.json(2);
    });
});

// change user verification
app.post('/changeverification', (req, res) => {
    // 1 email has been sent successfully
    // 2 server error
    // 3 email has not been sent
    if (req.body.verified) {
        changeVerification(req.body.id).then(() => {
            // inform the user by email that his account has been blocked
            blockAccount(req.body.email).then(() => {
                res.json(1);
            }).catch(err => {
                res.json(3);
            });
        }).catch(err => {
            res.json(2)
        });
    } else {
        changeVerification(req.body.id).then(() => {
           res.json(1)
        }).catch(err => {
            res.json(2)
        });
    }
});

// change user role 
app.post('/changeuserrole', (req, res) => {
    // 1 user role was changed successfully 
    // 2 user role was not changed 
    changeUserRole(req.body.id, req.body.role).then(() => {
        res.json(1)
    }).catch(err => {
        res.json(2)
    });
});

// edit user
app.post('/edit', (req, res) => {
    // 1 user edited successfully
    // 2 server error
    // 3 user already exists
    const id = req.body.id;
    const firstName = entities.encode(req.body.firstName.trim());
    const lastName = entities.encode(req.body.lastName.trim());
    const userName = entities.encode(req.body.userName.trim());
    const city = entities.encode(req.body.city);
    const password = req.body.password;
    if (req.files) {
        const userImg = req.files.userImg;
        if (id && firstName && lastName && userName) {
            editUser(id, firstName, lastName, userName, city, password, userImg).then(() => {
                res.json(1);
            }).catch(err => {
                if (err === "exist") {
                    res.json(3);
                } else{
                    res.json(2);
                }
            })
        } else {
            res.json(2);
        };
    } else {
        if (id && firstName && lastName && userName) {
            editUser(id, firstName, lastName, userName, city, password).then(() => {
                res.json(1);
            }).catch(err => {
                if (err === "exist") {
                    res.json(3);
                } else{
                    res.json(2);
                }
            })
        } else {
            res.json(2);
        };
    }
});

// send an email where the user can reset his password
app.post('/sendresetlink', (req, res) => {
    // 1 email was sent successfully
    // 2 server error
    // 3 user does not exist
    sendResetLink(req.body.email).then(() => {
        res.json(1);
    }).catch(err => {
        if (err === 3) {
            res.json(3);
        } else {
            res.json(2);
        }
    });
});

// reset the password of the user
app.post('/resetpass', (req, res) => {
    // 1 password reset was successful
    // 2 server error
    // 3 user does not exist
    resetPass(req.body.email, req.body.id, req.body.pass).then(() => {
        res.json(1);
    }).catch(err => {
        if (err === 3) {
            res.json(3);
        } else {
            res.json(2);
        }
    });
});

// delete user account 
app.post('/deleteuser', (req, res) => {
    // 1 account was deleted successfully
    // 2 account was not deleted
    deleteUser(req.body.id).then(() => {
        res.json(1);
    }).catch(() => {
        res.json(2);
    });
});

// get all users
app.post('/getallusers', (req, res) => {
    // 1 get all users from db successfully
    // 2 server error
    // 3 no users found
    getAllUsers().then((users) => {
        res.json(users);
    }).catch(err => {
        if (err === 3) {
            res.json(3);
        } else {
            res.json(2);
        }
    });
});

// get user to edit his data
app.post('/getuser', (req, res) => {
    // 1 get user successfully
    // 2 server error
    // 3 no user found
    getUser(req.body.id).then(user => {
        res.json(user);
    }).catch(err => {
        if (err === 3) {
            res.json(3);
        } else {
            res.json(2);
        }
    });
});

// send message from contact form
app.post('/sendmessage', (req, res) => {
    // 1 message was sent successfully
    // 2 message was not sent
    if (req.body.email.trim() && req.body.message.trim()) {
        sendMessage(req.body.email.trim(), req.body.message).then(() => {
            res.json(1);
        }).catch(() => {
            res.json(2);
        })
    } else {
        res.json(2);
    };
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
    log('Hub is connected');

    socket.on('user_connect', userID => {
        // join user
        socket.join(userID.toString());
        log(`user ${userID} is connected`);
        socket.broadcast.to(userID).emit('user_connect');

        // request for realtime data
        socket.on("getRealTimeData", request => {
            socket.broadcast.to(request.userId).emit("realTimeRequest", request.sn);
        });

        // request for stopping incoming data
        socket.on("stopRealTimeData", request => {
            socket.broadcast.to(request.userId).emit("stopRealTimeData", request.sn);
        });

        // turn water on off
        socket.on('waterOnOff', data => {
            socket.broadcast.to(userID).emit("waterOnOff", data);
        })

        // send the new configuration for waterpump
        socket.on('waterConf', data => {
            socket.broadcast.to(userID).emit("waterConf", data);
        })
        
        // user is disconnected
        socket.on('user_disconnect', userId => {
            socket.broadcast.to(userId).emit("user_disconnect");
        })

        // user is not online anymore
        socket.on('disconnect', () => {
            log('user is disconnected');
            socket.broadcast.to(userID).emit('user_disconnect');
        });
    }); 

    socket.on('hub_connect', data => {
        // check in the database if the hub exists
        SQL.checkExist('iot_hubs', '*', {sn_number: data.sn_number}).then(hubs => {
            if (hubs.length > 0) {
                if (hubs[0].user_id) {
                    // join user
                    socket.join(hubs[0].user_id);

                    // change the status from hub to connected in db
                    SQL.updateRecord("iot_hubs", {connected: 1}, {sn_number: data.sn_number}).then(() => {
                        socket.broadcast.to(hubs[0].user_id).emit('hub_connect', data.sn_number)
                        log(`Hub ${hubs[0].name} is connected now!`);
                        // get the devices that belong to this hub
                        SQL.checkExist('iot_device', '*', {hub_id: hubs[0].id}).then(devices => {
                            // send info about connected devices to raspberry
                            socket.emit('toDevice', devices);
                        }).catch(err => {
                            log(err);
                        });
                    }).catch(err => {
                        log(err);
                    });

                    // listening to info from raspberry
                    socket.on('device_connect', sn_number => {
                        // change the status from device to connected in DB
                        SQL.updateRecord('iot_device', {connected: 1}, {sn_number: sn_number}).then(() => {
                            socket.broadcast.to(hubs[0].user_id).emit('device_connect', sn_number);
                            log(`Device "${sn_number}" is connected now`);
                        }).catch(err => {
                            log(err);
                        });
                    });

                    // listening to info from raspberry
                    socket.on('device_disconnect', sn_number => {
                        // change the status from device to disconnected in DB
                        SQL.updateRecord('iot_device', {connected: 0}, {sn_number: sn_number}).then(() => {
                            socket.broadcast.to(hubs[0].user_id).emit('device_disconnect', sn_number);
                            log(`Device "${sn_number}" is disconnected now`);
                        }).catch(err => {
                            log(err);
                        });
                    });
                    
                    // listener for the incoming data
                    socket.on("realTimeData", info => {
                        // send the data back to the client
                        socket.broadcast.to(hubs[0].user_id).emit("realTimeIncomingData", info);
                    });

                    // save data from devices to db
                    socket.on("deviceDataInterval", info => {
                        SQL.insertMulti("iot_data", ["data", "device_id", "timestamp"], [JSON.stringify(info.data), info.device, 'now()']).then(result => {
                        });
                    });

                    // disconnect hub
                    socket.on('disconnect', () => {
                        // change the status from hub to disconnected in DB
                        SQL.updateRecord("iot_hubs", {connected: 0}, {sn_number: data.sn_number}).then(() => {
                            socket.broadcast.to(hubs[0].user_id).emit('hub_disconnect', data.sn_number);
                            log(`Hub "${hubs[0].name}" is disconnected now`);  
                            socket.disconnect();                      
                        }).catch(err => {
                            log(err);
                            socket.disconnect();
                        });
                    });
                } else {
                    // hub is not registered
                    log(`Hub ${data.sn_number} is not registered!`);
                    socket.disconnect();
                }
            } else {
                // hub is not found
                log(`Hub with ${data.sn_number} is not existing!`);
                socket.disconnect();
            }
        }).catch(err => {
            log(err);
            socket.disconnect();
        });
    });

    socket.on('disconnect', () => {
        // log('Hub is disconnected');
        socket.disconnect();
    });

});