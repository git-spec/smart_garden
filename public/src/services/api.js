/* ***************************************************** REGISTRATION ******************************************************* */
export const registerPost = (firstName, lastName, userName, email, password, repassword) => {
    const data = {
        firstName,
        lastName,
        userName,
        email,
        password,
        repassword
    };
    return new Promise((resolve, reject) => {
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
            } else {
                reject(new Error('can not send data to server. response number is: ' + response.status));
            }
        }).catch(err => {
            reject(err);
        });
    });
};

export const verifyUserPost = email => {
    return new Promise((resolve, reject) => {
        fetch('/verifyuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email})
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
            } else {
                reject(new Error('can not get the data, response number is: ' + response.status));
            }
        }).catch(err => {
            reject(err);
        });
    });
};

/* ***************************************************** LOGIN ******************************************************* */
export const loginPost = (email, password) => {
    return new Promise((resolve, reject) => {
        const data = {
            email,
            password
        };
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
            } else {
                reject(new Error('can not send the data, response number is: ' + response.status));
            }
        }).catch(err => {
            reject(err);
        });
    });
};

export const checkLoginPost = () => {
    return new Promise((resolve, reject) => {
        fetch('/checklogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
            } else {
                reject(new Error('Can not send data to server. Response number: ' + response.status));
            }
        }).catch(err => {
            reject(err);
        });
    });
};

/* ***************************************************** LOGOUT ******************************************************* */
export const logoutPost = () => {
    return new Promise((resolve, reject) => {
        fetch('/user/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
            } else {
                reject(new Error('Can not send data to server. Response number: ' + response.status));
            }
        }).catch(err => {
            reject(err);
        });
    });
};

/* ***************************************************** USER PROFILE ******************************************************* */
export const getUserPost = id => {
    return new Promise((resolve, reject) => {
        fetch('/getuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id})
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
            } else {
                reject(new Error('Can not send data to server. Response number: ' + response.status));
            }
        }).catch(err => {
            reject(err);
        });
    });
};

export const editUserPost = (id, firstName, lastName, userName, city, password, repassword, userImg) => {
    return new Promise((resolve, reject) => {
        const fd = new FormData();
        if (userImg) {
            fd.append('userImg', userImg);
        }
        fd.append('id', id);
        fd.append('firstName', firstName);
        fd.append('lastName', lastName);
        fd.append('userName', userName);
        fd.append('city', city);
        fd.append('password', password);
        fd.append('repassword', repassword);
        fetch('/edituser', {
            method: 'POST',
            body: fd
        }).then(response => {
            if (response.status === 200) {
                response.json().then(receivedData => {
                    resolve(receivedData);
                }).catch(err => {
                    reject(err);
                });
            } else {
                reject(new Error('can not send data to server. response number is: ' + response.status));
            }
        }).catch(err => {
            reject(err);
        });
    });
};

/* ***************************************************** RESET PASSWORD ******************************************************* */
export const sendResetLinkPost = email => {
    return new Promise((resolve, reject) => {
        fetch('/sendresetlink', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email})
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
            } else {
                reject(new Error('can not get the data, response number is: ' + response.status));
            }
        }).catch(err => {
            reject(err);
        });
    });
};

export const resetPasswordPost = (email, id, pass) => {
    return new Promise((resolve, reject) => {
        const data = {
            email,
            id,
            pass
        };
        fetch('/resetpassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
            } else {
                reject(new Error('can not get the data, response number is: ' + response.status));
            }
        }).catch(err => {
            reject(err);
        });
    });
};

/* ***************************************************** ADMIN PANEL ******************************************************* */
export const getAllUsersPost = () => {
    return new Promise((resolve, reject) => {
        fetch('/getallusers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
            } else {
                reject(new Error('Can not send data to server. Response number: ' + response.status));
            }
        }).catch(err => {
            reject(err);
        });
    });
};

export const changeVerificationPost = (id, email, verified)  => {
    return new Promise((resolve, reject) => {
        const data = {
            id,
            email,
            verified
        };
        fetch('/changeverification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
            } else {
                reject(new Error('can not get the data, response number is: ' + response.status));
            }
        }).catch(err => {
            reject(err);
        });
    });
};

export const deleteUserPost = (id)  => {
    return new Promise((resolve, reject) => {
        fetch('/deleteuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id})
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
            } else {
                reject(new Error('can not get the data, response number is: ' + response.status));
            }
        }).catch(err => {
            reject(err);
        });
    });
};

export const changeUserRolePost = (id, role)  => {
    return new Promise((resolve, reject) => {
        const data = {
            id,
            role
        };
        fetch('/changeuserrole', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
            } else {
                reject(new Error('can not get the data, response number is: ' + response.status));
            }
        }).catch(err => {
            reject(err);
        });
    });
};

/* ***************************************************** CONTACT ******************************************************* */
export const sendMessagePost = (email, message)  => {
    return new Promise((resolve, reject) => {
        const data = {
            email,
            message
        };
        fetch('/sendmessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
            } else {
                reject(new Error('can not get the data, response number is: ' + response.status));
            }
        }).catch(err => {
            reject(err);
        });
    });
};
