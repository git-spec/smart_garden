const socket = require('socket.io-client')('http://felix.local:5000');
const {log} = require('console');

const Transmitter = require('./modules/transmitter');
const radio = new Transmitter();
radio.setReadingPipe('0xABCDABCD71');
radio.begin();

// [{
//     id: 0,
//     name: "name",
//     sn_number: "0xABCDABCDABCD",
//     user_id: 1,
//     hub_id: 5,
//     connected: 1,
//     requestDataInterval: false,
//     focus: false
// },....]

const hub_info = {
    sn_number: '0xABCDABCD71'
};
socket.on('connect', () => {
    log('connected');
    socket.emit('hub_connect', hub_info);
    // checking all devices every 20 seconds
    setInterval(() => {
        checkAllDevices();
    }, 20 * 1000);
    // saving data to db every 30 minutes
    setInterval(() => {
        requestDataInterval();
    }, 30 * 60 * 1000);
});

// list of all devices in the cloud
let devices = [];
socket.on('toDevice', receivedDevices => {
    devices = receivedDevices;
    devices.forEach(device => {device.requestDataInterval = false; device.focus = false});
});


let userConnected = false;
socket.on('user_connect', () => {
    userConnected = true;
    log('The user is online now');
    // send order to all devices to get realtime data
    // requestRealTimeDataFromAllDevices();
});
socket.on('user_disconnect', () => {
    userConnected = false;
    stopRequestRealTimeDataFromAllDevices();
});


// incoming order for realtime data
socket.on('realTimeRequest', sn => {
    // change focus to true
    const device = devices[devices.map(device => device.sn_number).indexOf(sn)]
    if(device){
        devices[devices.map(device => device.sn_number).indexOf(sn)].focus = true;
        // realtime data request for all devices except waterpump
        if (devices[devices.map(device => device.sn_number).indexOf(sn)].type_id != 2) {
            radio.send('realTimeData', 10, sn).then(() => {
                log(`realtime data request sent to "${sn}"`);
            }).catch(error => {
                log(error);
            });
        }
    }
});
// stop real time data for some device
socket.on('stopRealTimeData', sn => {
    // change focus to false
    const device = devices[devices.map(device => device.sn_number).indexOf(sn)]
    if(device){
        devices[devices.map(device => device.sn_number).indexOf(sn)].focus = false;
        radio.send('stopRealTimeData', 10, sn).then(() => {
            log(`stop realtime data request for device "${sn}"`);
        }).catch(error => {
            log(error);
        });
    }
});

// get status from water switcher
socket.on('waterOnOff', data => {
    // switch status from device inside devices
    const device = devices[devices.map(device => device.sn_number).indexOf(data.sn)]
    if(device){
        devices[devices.map(device => device.sn_number).indexOf(data.sn)].status = data.status;
        const message = data.status ? 'on' : 'off';
        // send message on or off to arduino
        radio.send(message, 10, data.sn).then(() => {
            log(`status for water device ${data.sn}: "${data.status}"`);
        }).catch(error => {
            log(error);
        });
    }
});

socket.on('waterConf', data => {
    // switch status from device inside devices
    const device = devices[devices.map(device => device.sn_number).indexOf(data.sn)]
    if(device){
        devices[devices.map(device => device.sn_number).indexOf(data.sn)].water_time = data.time;
        devices[devices.map(device => device.sn_number).indexOf(data.sn)].water_duration = data.duration;
        devices[devices.map(device => device.sn_number).indexOf(data.sn)].moisture_device_id= data.soilMoistureDevice;
        const message = data.status ? 'on' : 'off';
        // send message on or off to arduino
        radio.send('conf-' + (data.duration ? data.duration : '5'), 3, device.sn_number).then(() => {

        }).catch(err => {
            
        })
    }
})



// read the data getting from device
radio.read(data => {
    const sn = data.substr(0, data.indexOf('-'));
    const message = data.substr(data.indexOf('-') + 1, data.length);
    const device = devices.find(device => device.sn_number === sn);
    if (device && message) {
        if (message.toString().replace(/\x00/gi, '') === 'yup' || message.toString().replace(/\x00/gi, '') === 'hi') {
            // device is connected
            let dev = devices.find(item => item.sn_number === device.sn_number && !item.connected);
            if (dev) {
                if (dev.type_id === 2) {
                    radio.send('conf-' + (dev.water_duration ? dev.water_duration : '5'), 3, dev.sn_number).then(() => {

                    }).catch(err => {
                        
                    })
                }
                // set the device from which the data was received to connected
                dev.connected = 1;
                devices[devices.map(device => device.id).indexOf(device.id)] = dev;
                log(`Device "${device.name}" is connected now`);
                socket.emit('device_connect', device.sn_number);
            }
        } else {
            // getting sensor data from device
            log(`Message from "${sn}": ${message}`);
            let str = message.replace(/\0/g, '');
            let data = [];
            str.split('|').forEach(number => {
                data.push(number);
            });
            let dev = devices.find(item => item.sn_number === device.sn_number && item.requestDataInterval);
            if (dev) {
                if(dev.type_id == 1){
                    const waterDevices = devices.filter(device => device.moisture_device_id == dev.id)
                    waterDevices.forEach(device => {
                        const triggerValue = parseInt(device.water_time)
                        const currentValue = parseInt(data[0])
                        if(currentValue < triggerValue) {
                            radio.send('conf-' + (device.water_duration ? device.water_duration : '5'), 3, device.sn_number).then(() => {
                                radio.send('on' , 3, device.sn_number).then(() => {

                                }).catch(err => {
                                    
                                })
                            }).catch(err => {
                                
                            })
                        }
                    })
                }
                // sending data to database
                devices[devices.map(device => device.id).indexOf(dev.id)].requestDataInterval = false;
                socket.emit('deviceDataInterval', {device: dev.id, data: data});
                if (!dev.focus) {
                    // stop getting realtime data
                    radio.send('stopRealTimeData', 10, dev.sn_number).then(() => {
                        log(`stop real time data for device "${sn}"`);
                    }).catch(error => {
                        log(error);
                    })
                }
            } else {
                // sending realtime data
                if (device.focus) {
                    socket.emit('realTimeData', {sn_number: sn, data: data});
                }
            }
        }
    }
}, () => {
    console.log('reading stopped');
});


// check connection for each device connected to this hub
function checkAllDevices() {
    // recursivePromises(0, checkConnected);
    devices.forEach(device => {
        checkConnected(device).then(() => {

        }).catch(error => {

        })
    })
}
const checkConnected = device => {
    return new Promise((resolve, reject) => {
        radio.checkConnected('hi', 10, device.sn_number).then(() => {
            let dev = devices.find(item => item.sn_number === device.sn_number && !item.connected);
            if (dev) {
                dev.connected = 1;
                devices[devices.map(device => device.id).indexOf(device.id)] = dev;
                log(`Device "${device.name}" is connected now`);
                socket.emit('device_connect', device.sn_number);
            }
            resolve();
        }).catch(() => {
            let dev = devices.find(item => item.sn_number === device.sn_number && item.connected);
            if (dev) {
                dev.connected = 0;
                devices[devices.map(device => device.id).indexOf(device.id)] = dev;
                log(`Device "${device.name}" is disconnected now`);
                socket.emit('device_disconnect', device.sn_number);
            }
            reject(`Device "${device.name}" is disconnected`);
        });
    });
};


// interval request data from devices
function requestDataInterval(){
    requestRealTimeDataFromAllDevices();
}
function requestRealTimeDataFromAllDevices() {
    // recursivePromises(0, requestRealTimeData);
    devices.forEach(device => {
        if (device.type_id !== 2) {
            requestRealTimeData(device).then(() => {

            }).catch(error => {

            })
        }
    })
}
function requestRealTimeData(device) {
    return new Promise((resolve, reject) => {
        device.requestDataInterval = true;
        radio.send('realTimeData', 10, device.sn_number).then(() => {
            resolve();
        }).catch(error => {
            log(error);
            reject(error);
        });
    });
}


// stop request realtime data from devices
function stopRequestRealTimeDataFromAllDevices() {
    // recursivePromises(0, stopRequestRealTimeData);
    devices.forEach(device => {
        if (device.type_id !== 2) {
            stopRequestRealTimeData(device).then(() => {

            }).catch(error => {

            })
        }
    })
}
function stopRequestRealTimeData(device) {
    return new Promise((resolve, reject) => {
        radio.send('stopRealTimeData', 10, device.sn_number).then(() => {
            resolve();
        }).catch(error => {
            log(error);
            reject(error);
        });
    });
}


/**
 *
 * @param {*} i
 */
// function recursivePromises(i, promiseToDo) {
//     if (i < devices.length) {
//         const dev = devices[i];
//         i++;
//         promiseToDo(dev).then(() => {
//             recursivePromises(i, promiseToDo);
//         }).catch(error => {
//             // log(error)
//             recursivePromises(i, promiseToDo);
//         });
//     } else {
//         return;
//     }
// }