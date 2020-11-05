/* ***************************************************** SETUP ******************************************************* */
// modules
const {runQuery} = require('./mysqlCon');
const emailSender = require('./emailSender');
var validator = require('validator');
const passwordHash = require('password-hash');

/* ***************************************************** FUNCTIONS ******************************************************* */
// login with checking the user's email OR username
function checkUser(user, password) {
    // console.log("this is the user: " + user + password);
    return new Promise((resolve, reject) => {
        if (validator.isEmail(user)) {
            runQuery(`SELECT * FROM users where email like '${user}'`).then(result => {
                if (result.length === 0) {
                    reject(4);
                } else {
                    if (passwordHash.verify(password, result[0].password)) {
                        if (result[0].verified) {
                            resolve(result[0]);
                        }
                    } else {
                        reject(3);
                    }
                }
            }).catch(error => {
                reject(error);
            });
        } else {
            runQuery(`SELECT * FROM users where username like '${user}'`).then(result => {
                if (result.length === 0) {
                    reject(4);
                } else {
                    if (passwordHash.verify(password, result[0].password)) {
                        if (result[0].verified) {
                            resolve(result[0]);
                        }
                    } else {
                        reject(3);
                    }
                }
            }).catch(err => {
                reject(err);
            });
        }
    });
}

// register user
function registerUser(firstName, lastName, userName, email, password) {
    return new Promise((resolve, reject) => {
        runQuery(
            `INSERT INTO users (firstname, lastname, username, email, password, verified, role) 
            VALUES ('${firstName}','${lastName}','${userName}','${email}', '${passwordHash.generate(password)}', 0, 'user')`
        ).then(() => {
            // email message
            let message = `Hello ${firstName} ${lastName},\n`;
            message += 'Welcome to our website!\n';
            message += 'To verify your email address please click on the following link:\n';
            message += `http://localhost:3000/verify/${email}`;
            emailSender.sendEmail(email, 'Verify your email', message).then(() => {
                resolve();
            }).catch(error => {
                reject(error);
            });
        }).catch(err => {
            if (err.errno === 1062) {
                reject('exist');
            } else {
                reject(err);
            }
        });
    });
}

// edit user
function editUser(id, firstName, lastName, userName, city, password) {
    return new Promise((resolve, reject) => {
        runQuery(
            `UPDATE users SET users.firstname='${firstName}', users.lastname='${lastName}', users.username='${userName}', 
            users.city='${city}', users.password='${passwordHash.generate(password)}' WHERE users.id=${id}`
        ).then(result => {
            resolve(result);
        }).catch(err => {
            if (err.errno === 1062) {
                reject('exist');
            } else {
                reject(err);
            }
        });
    });
}

// verify user
function verifyUser(email) {
    return new Promise((resolve, reject) => {
        runQuery(`UPDATE users SET users.verified = 1 WHERE users.email = '${email}'`).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

// send verify confirm message
function confirmVerifiedUser(email) {
    return new Promise((resolve, reject) => {
        // email message
        let message = 'Thanks for verifying your email!\n';
        message += 'You can now log in on our site:\n';
        message += 'http://localhost:3000/login\n';
        message += 'Have fun!';
        emailSender.sendEmail(email, 'Email verification confirmed', message).then(() => {
            resolve();
        }).catch(error => {
            reject(error);
        });
    });
}

// send link to reset users password
function sendResetLink(email) {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM users where email like '${email}'`).then(result => {
            if (result.length) {
                // email message
                let message = 'Please click here to reset your password:\n';
                message += `http://localhost:3000/reset/${result[0].id * 135531}/${email}`;
                emailSender.sendEmail(email, 'Reset account password', message).then(() => {
                    resolve();
                }).catch(error => {
                    reject(error);
                });
                // resolve(result);
            } else {
                reject(4);
            }
        }).catch(err => {
            reject(2);
        });
    });
}

// send link to reset users password
function resetPass(email, id, pass) {
    return new Promise((resolve, reject) => {
        const Id = id / 135531;
        runQuery(
            `UPDATE users SET password = '${passwordHash.generate(pass)}' WHERE email like '${email}' and id = ${Id}`
        ).then(result => {
            // console.log('here is the result ' + result);
            if (result) {
                // email message
                let message = 'You have successfully changed your password!\n';
                message += 'Log in now with your new password:\n';
                message += 'http://localhost:3000/login';
                emailSender.sendEmail(email, 'Password changed', message).then(() => {
                    resolve();
                }).catch(error => {
                    reject(error);
                });
                // resolve(result);
            } else {
                reject(4);
            }
        }).catch(err => {
            reject(2);
        });
    });
}

// get all users
function getAllUsers() {
    return new Promise((resolve, reject) => {
            runQuery(`SELECT * FROM users`).then(users => {
                if (users.length === 0) {
                    reject(2);
                } else {
                    // console.log(users[0]);
                    resolve(users);
                }

                // resolve(users);

            }).catch(error => {
                reject(error);
            });
    });
}

// get user for edit page
function getUser(id) {
    return new Promise((resolve, reject) => {
            runQuery(`SELECT * FROM users WHERE id = ${id}`).then(users => {
                if (users.length === 0) {
                    reject(2);
                } else {
                    resolve(users[0]);
                }
            }).catch(error => {
                reject(error);
            });
    });
}

// changeVerificationPost
function changeVerificationPost(id) {
    return new Promise((resolve, reject) => {
        runQuery(
            `UPDATE users SET verified = !verified  WHERE users.id=${id}`
        ).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
        });
    });
}


function tellUserAboutAccountState(email) {
    return new Promise((resolve, reject) => {
        // email message
        let message = 'Your email is Blocked!\n';
        message += 'You can not log in on our site:\n';
        message += 'Please call the Administrator to solve this issues \n';
        message += 'http://localhost:3000/login\n';
        emailSender.sendEmail(email, 'Email verification confirmed', message).then(() => {
            resolve();
        }).catch(error => {
            reject(error);
        });
    });
}
/* ***************************************************** EXPORT ******************************************************* */
module.exports = {
    editUser,
    checkUser,
    registerUser,
    verifyUser,
    confirmVerifiedUser,
    sendResetLink,
    resetPass,
    getAllUsers,
    getUser,
    changeVerificationPost,
    tellUserAboutAccountState
};
