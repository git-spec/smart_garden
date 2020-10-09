export const checkHubNumPost = hubNum => {
    return new Promise((resolve, reject) => {
        fetch('/checkhubnum', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({hubNum})
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

export const checkDeviceNumPost = deviceNum => {
    return new Promise((resolve, reject) => {
        fetch('/checkdevicenum', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({deviceNum})
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

export const addHubPost = hubNum => {
    return new Promise((resolve, reject) => {
        fetch('/addhub', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({hubNum})
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

export const addDevicePost = (deviceNum, hubID) => {
    return new Promise((resolve, reject) => {
        fetch('/adddevice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({deviceNum, hubID})
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

export const getHubsPost = () => {
    return new Promise((resolve, reject) => {
        fetch('/gethubs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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

export const getDevicesPost = hubID => {
    return new Promise((resolve, reject) => {
        fetch('/getdevices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({hubID})
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

export const deleteHubPost = hubID => {
    return new Promise((resolve, reject) => {
        fetch('/deletehub', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({hubID})
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

export const deleteDevicePost = (deviceID, hubID) => {
    return new Promise((resolve, reject) => {
        fetch('/deletedevice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({deviceID, hubID})
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
