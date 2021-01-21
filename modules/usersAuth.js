/* ***************************************************** SETUP ******************************************************* */
const {runQuery} = require('./mysqlCon');
const emailSender = require('./emailSender');
var validator = require('validator');
const passwordHash = require('password-hash');

/* ***************************************************** REGISTRATION ******************************************************* */
// registers the user
function registerUser(firstName, lastName, userName, email, password) {
    return new Promise((resolve, reject) => {
        // validate unique user
        const queryResult = {
            email: null,
            username: null
        };
        try {
            (async () => { 
                const emailQuery = await runQuery(`SELECT email FROM users WHERE email='${email}'`);
                if (emailQuery.length !== 0) {
                    queryResult.email = true;
                };
                const userNameQuery = await runQuery(`SELECT username FROM users WHERE username='${userName}'`);
                if (userNameQuery.length !== 0) {
                    queryResult.username = true;
                };
                if (!queryResult.email && !queryResult.username) {
                    // send email to verify user
                    let message = `Hello ${firstName} ${lastName},\n`;
                    message += 'Welcome to our website!\n';
                    message += 'To verify your email address please click on the following link:\n';
                    message += `http://localhost:3000/verify/${email}/` + '\n';
                    // message += `https://garden.felixwurst.de/verify/${email}/` + '\n';
                    message += 'After a successful Verification you are able to login.\n\n';
                    message += 'Best Regards\n';
                    message += 'Your inatu-team';
                    emailSender.sendEmail(email, 'Verify your email', message).then(() => {
                        // add user to db
                        runQuery(
                            `INSERT INTO users (firstname, lastname, username, email, password, verified, role) 
                            VALUES ('${firstName}','${lastName}','${userName}','${email}', '${passwordHash.generate(password)}', 0, 'user')`
                        ).then(() => {
                            resolve(queryResult);
                        }).catch(err => {
                            reject(err);
                        });
                    }).catch(err => {
                        reject(err);
                    });
                } else if (queryResult.email) {
                    resolve(queryResult);
                } else if (queryResult.username) {
                    resolve(queryResult);
                } else {
                    resolve(queryResult);
                };
            })();
        }
        catch (e) {
            reject(e);
        }
    });
}

// verifies the user after registration
function verifyUser(email) {
    return new Promise((resolve, reject) => {
        runQuery(`UPDATE users SET users.verified=1 WHERE users.email='${email}'`).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

// sends an email that the verification is confirmed
function confirmVerifiedUser(email) {
    return new Promise((resolve, reject) => {
        // content of email
        let message = 'Thanks for verifying your email!\n';
        message += 'You can now log in on our site:\n';
        message += 'http://localhost:3000/login\n';
        // message += 'https://garden.felixwurst.de/login\n';
        message += 'Have fun!';
        emailSender.sendEmail(email, 'Email verification confirmed', message).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

/* ***************************************************** LOGIN ******************************************************* */
// checks the email or username of the user at login
function checkUser(user, password) {
    return new Promise((resolve, reject) => {
        if (validator.isEmail(user)) {
            runQuery(`SELECT * FROM users WHERE email LIKE '${user}'`).then(result => {
                if (result.length === 0) {
                    reject(3);
                } else {
                    if (passwordHash.verify(password, result[0].password)) {
                        resolve(result[0]);
                    } else {
                        reject(5);
                    }
                }
            }).catch(err => {
                reject(err);
            });
        } else {
            runQuery(`SELECT * FROM users WHERE username LIKE '${user}'`).then(result => {
                if (result.length === 0) {
                    reject(4);
                } else {
                    if (passwordHash.verify(password, result[0].password)) {
                        resolve(result[0]);
                    } else {
                        reject(5);
                    }
                }
            }).catch(err => {
                reject(err);
            });
        }
    });
}

/* ***************************************************** USER PROFILE ******************************************************* */
// gets the user data to edit them on the user profile page
function getUser(id) {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM users WHERE id=${id}`).then(users => {
            if (users.length === 0) {
                reject(3);
            } else {
                resolve(users[0]);
            }
        }).catch(err => {
            reject(err);
        });
    });
}

// edits the user on the profile page
function editUser(userID, firstName, lastName, userName, city, password, userImg) {
    return new Promise((resolve, reject) => {
        let query = `UPDATE users SET users.firstname='${firstName}', users.lastname='${lastName}', users.username='${userName}', users.city='${city}'`;
        // if the user has also entered a new password
        if (password) {
            query += `, users.password='${passwordHash.generate(password)}'`;
        }
        // if the user has also uploaded a new image
        if (userImg) {
            // gets the file format of the image
            const ext = userImg.name.substr(userImg.name.lastIndexOf('.'));
            // sets new image name from the username
            const newName = userName.trim().replace(/ /g, '_') + ext;
            // saves image in public folder
            userImg.mv('./public/uploads/' + newName);
            // url of the image to be stored in the database
            const imgUrl = '/uploads/' + newName;
            query += `, users.img='${imgUrl}'`
        }
        query += ` WHERE users.id=${userID};`;
        runQuery(query).then(() => {
            getUser(userID).then(user => {
                resolve(user);
            }).catch(err => {
                reject(err);
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

/* ***************************************************** RESET PASSWORD ******************************************************* */
// sends email with link to reset user password
function sendResetLink(email) {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM users WHERE email LIKE '${email}'`).then(result => {
            if (result.length) {
                // content of email
                let message = 'Please click here to reset your password:\n';
                message += `http://localhost:3000/reset/${result[0].id * 135531}/${email}`;
                // message += `https://garden.felixwurst.de/reset/${result[0].id * 135531}/${email}`;
                emailSender.sendEmail(email, 'Reset account password', message).then(() => {
                    resolve();
                }).catch(err => {
                    reject(err);
                });
            } else {
                reject(3);
            }
        }).catch(() => {
            reject(2);
        });
    });
}

// sends email that user has changed his password successfully
function resetPassword(email, id, pass) {
    return new Promise((resolve, reject) => {
        const Id = id / 135531;
        runQuery(
            `UPDATE users SET password='${passwordHash.generate(pass)}' WHERE email LIKE '${email}' AND id=${Id}`
        ).then(result => {
            if (result) {
                // content of email
                let message = 'You have successfully changed your password!\n';
                message += 'Log in now with your new password:\n';
                message += 'http://localhost:3000/login';
                // message += 'https://garden.felixwurst.de/login';
                emailSender.sendEmail(email, 'Password changed', message).then(() => {
                    resolve();
                }).catch(err => {
                    reject(err);
                });
            } else {
                reject(3);
            }
        }).catch(() => {
            reject(2);
        });
    });
}

/* ***************************************************** ADMIN PANEL ******************************************************* */
// gets all users for admin panel
function getAllUsers() {
    return new Promise((resolve, reject) => {
        runQuery('SELECT * FROM users').then(users => {
            if (users.length === 0) {
                reject(3);
            } else {
                resolve(users);
            }
        }).catch(err => {
            reject(err);
        });
    });
}

// changes verification / blocks user
function changeVerification(id) {
    return new Promise((resolve, reject) => {
        runQuery(`UPDATE users SET verified=!verified WHERE users.id=${id}`).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
        });
    });
}

// informs the user by email that his account has been blocked
function informBlockedUserByEmail(email) {
    return new Promise((resolve, reject) => {
        // content of email
        let message = 'Your account has been blocked!\n';
        message += 'You can no longer log in to our site.\n';
        message += 'Please contact the administrator to solve this problem.';
        emailSender.sendEmail(email, 'Account has been blocked', message).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

// changes the role of the user
function changeUserRole(id, role) {
    return new Promise((resolve, reject) => {
        runQuery(`UPDATE users SET role='${role}' WHERE users.id=${id}`).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
        });
    });
}

// deletes a user account
function deleteUser(id) {
    return new Promise((resolve, reject) => {
        runQuery(`DELETE FROM users WHERE users.id=${id}`).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
        });
    });
}

/* ***************************************************** CONTACT ******************************************************* */
// send message from contact page
function sendMessage(email, userMessage) {
    return new Promise((resolve, reject) => {
        // content of email
        let message = `Message received from contact page from ${email}\n`;
        message += 'Content:\n';
        message += userMessage;
        emailSender.sendEmail('felix.wurst@gmail.com', 'Message from contact page', message).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
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
    resetPassword,
    getAllUsers,
    getUser,
    changeVerification,
    informBlockedUserByEmail,
    deleteUser,
    changeUserRole,
    sendMessage
};
