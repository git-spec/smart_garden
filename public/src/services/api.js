export const registerPost = (firstName, lastName, userName, email, password, repassword) => {
    const sendData = {
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
            body: JSON.stringify(sendData)
        }).then(response => {
            if (response.status === 200) {
                response.json().then(receivedData => {
                    resolve(receivedData);
                }).catch(error => {
                    reject(error);
                });
            } else {
                reject(new Error('can not send data to server. response number is: ' + response.status));
            }
        }).catch(error => {
            reject(error);
        });
    });
};

export const editPost = (id, firstName, lastName, userName, city, password, repassword) => {
    const sendData = {
        id,
        firstName,
        lastName,
        userName,
        city,
        password,
        repassword
    };
    return new Promise((resolve, reject) => {
        fetch('/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendData)
        }).then(response => {
            if (response.status === 200) {
                response.json().then(receivedData => {
                    resolve(receivedData);
                })
                .catch(err => {
                    reject(err);
                });
            } else {
                reject(new Error('can not send data to server. response number is: ' + response.status));
            }
        }).catch(error => {
            reject(error);
        });
    });
};

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
                }).catch(error => {
                    reject(error);
                });
            } else {
                reject(new Error('can not send the data, response number is: ' + response.status));
            }
        }).catch(error => {
            reject(error);
        });
    });
};

export const sendParams = email => {
    return new Promise((resolve, reject) => {
        const data = {
            email
        };
        fetch('/verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            } else {
                reject(new Error('can not get the data, response number is: ' + response.status));
            }
        }).catch(error => {
            reject(error);
        });
    });
};

export const sendResetLink = email => {
    return new Promise((resolve, reject) => {
        const data = {
            email
        };
        fetch('/sendResetLink', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            } else {
                reject(new Error('can not get the data, response number is: ' + response.status));
            }
        }).catch(error => {
            reject(error);
        });
    });
};

export const resetPass = (email, id, pass) => {
    return new Promise((resolve, reject) => {
        const data = {
            email,
            id,
            pass
        };
        fetch('/resetPass', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            } else {
                reject(new Error('can not get the data, response number is: ' + response.status));
            }
        }).catch(error => {
            reject(error);
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
                }).catch(error => {
                    reject(error);
                });
            } else {
                reject(new Error('Can not send data to server. Response number: ' + response.status));
            }
        }).catch(error => {
            reject(error);
        });
    });
};

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
                }).catch(error => {
                    reject(error);
                });
            } else {
                reject(new Error('Can not send data to server. Response number: ' + response.status));
            }
        }).catch(error => {
            reject(error);
        });
    });
};

export const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        fetch('/getAllUsers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            } else {
                reject(new Error('Can not send data to server. Response number: ' + response.status));
            }
        }).catch(error => {
            reject(error);
        });
    });
};

export const getUser = (id) => {
    return new Promise((resolve, reject) => {
        const data = {
            id,
        };
        fetch('/getUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            } else {
                reject(new Error('Can not send data to server. Response number: ' + response.status));
            }
        }).catch(error => {
            reject(error);
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
        fetch('/changeVerificationPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            } else {
                reject(new Error('can not get the data, response number is: ' + response.status));
            }
        }).catch(error => {
            reject(error);
        });
    });
};

export const deleteUserPost = (id)  => {
    return new Promise((resolve, reject) => {
        const data = {
            id,
        };
        fetch('/deleteUserPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            } else {
                reject(new Error('can not get the data, response number is: ' + response.status));
            }
        }).catch(error => {
            reject(error);
        });
    });
};

export const changeUserRolePost = (id, role)  => {
    return new Promise((resolve, reject) => {
        const data = {
            id,
            role
        };
        fetch('/changeUserRolePost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            } else {
                reject(new Error('can not get the data, response number is: ' + response.status));
            }
        }).catch(error => {
            reject(error);
        });
    });
};
