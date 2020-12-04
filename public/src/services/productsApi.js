export const checkHubNumPost = hubNum => {
    return new Promise((resolve, reject) => {
        fetch('/user/checkhubnum', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({hubNum})
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

export const checkDeviceNumPost = deviceNum => {
    return new Promise((resolve, reject) => {
        fetch('/user/checkdevicenum', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({deviceNum})
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

export const addHubPost = (hubName, hubNum) => {
    return new Promise((resolve, reject) => {
        fetch('/user/addhub', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({hubName, hubNum})
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

export const addDevicePost = (deviceName, deviceNum, hubID) => {
    return new Promise((resolve, reject) => {
        fetch('/user/adddevice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({deviceName, deviceNum, hubID})
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

export const getHubsPost = () => {
    return new Promise((resolve, reject) => {
        fetch('/user/gethubs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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

export const getDevicesPost = () => {
    return new Promise((resolve, reject) => {
        fetch('/user/getdevices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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

export const deleteHubPost = hubID => {
    return new Promise((resolve, reject) => {
        fetch('/user/deletehub', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({hubID})
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

export const deleteDevicePost = deviceID => {
    return new Promise((resolve, reject) => {
        fetch('/user/deletedevice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({deviceID})
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

export const deviceOnOffPost = (deviceSN, deviceStatus) => {
    return new Promise((resolve, reject) => {
        fetch('/user/deviceonoff', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({deviceSN, deviceStatus})
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

export const saveRangesPost = (inputRangeTime, inputRangeDuration, deviceSn, soilMoistureDevice) => {
    return new Promise((resolve, reject) => {
        fetch('/user/saveranges', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({inputRangeTime, inputRangeDuration, deviceSn, soilMoistureDevice})
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

export const deviceMoistureDataPost = (deviceID) => {
    return new Promise((resolve, reject) => {
        fetch('/user/devicemoisturedata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({deviceID})
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

export const deviceTempHumDataPost = (deviceID) => {
    return new Promise((resolve, reject) => {
        fetch('/user/devicetemphumdata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({deviceID})
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

export const deviceLightDataPost = (deviceID) => {
    return new Promise((resolve, reject) => {
        fetch('/user/devicelightdata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({deviceID})
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
