const socket = require('socket.io-client')('http://felix.local:5000');
const Transmitter = require('./modules/transmitter');
const radio = new Transmitter();
radio.setReadingPipe('0xABCDABCD71');
const {log} = require('console');

const hub_info = {
    sn_number: '0xABCDABCD71'
};
socket.on('connect', () => {
    log('connected');
    socket.emit('hub_connect', hub_info);
    // checking all devices every 20 seconds
    setInterval(() => {
        checkAllDevices();
    }, 20 * 1000); // 20 s
    setInterval(() => {
        requestDataInterval();
    }, 30 * 60 * 1000); // 30 mins  
});

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

// list of all devices in the cloud
let devices = [];
socket.on('toDevice', receivedDevices => {
    // save received devices to devices array
    devices = receivedDevices;
    devices.forEach(device => {device.requestDataInterval = false; device.focus = false});
});

let userConnected = false;
// user is online now
socket.on('user_connect', () => {
    log('The user is online now & asking for realtime data');
    userConnected = true;
    // send order to all devices to get realtime data
    // requestRealTimeDataFromAllDevices();
});

socket.on('user_disconnect', () => {
    userConnected = false;
    stopRequestRealTimeDataFromAllDevices();
});

// incoming order for realtime date
socket.on('realTimeRequest', sn => {
    // change focus
    devices[devices.map(device => device.sn_number).indexOf(sn)].focus = true;
    // log(devices);
    radio.send('realTimeData', 10, sn).then(() => {
        log(`Real time request sent to "${sn}"`);
    }).catch(error => {
        log(error);
    });
});

// stop real time data for some device
socket.on('stopRealTimeData', sn => {
    devices[devices.map(device => device.sn_number).indexOf(sn)].focus = false;
    radio.send('stopRealTimeData', 10, sn).then(() => {
        log(`stop real time data for device "${sn}"`);
    }).catch(error => {
        log(error);
    })
})

// interval request data from devices
function requestDataInterval(){
    requestRealTimeDataFromAllDevices()
}

/**
 * test to send order data request to AR c
 *
 */
// radio.send("realTimeData", 10, "0x744d52687C").then(()=>{log("request data sent")})
radio.read(data => {
    // log('sent data from arduino: ', data);
    const sn = data.substr(0, data.indexOf('-'));
    const message = data.substr(data.indexOf('-') + 1, data.length);
    const device = devices.find(device => device.sn_number === sn);
    if (device && message) {
        if (message.toString().replace(/\x00/gi, '') === 'yup') { 
            // device is connected 
            let dev = devices.find(item => item.sn_number === device.sn_number && !item.connected);
            if (dev) {
                // set the device from which the data was received to connected
                dev.connected = 1;
                devices[devices.map(device => device.id).indexOf(device.id)] = dev;
                log(`Device "${device.name}" is connected now`);
                socket.emit('device_connect', device.sn_number);
            }
        } else { 
            // device is sending realtime data
            log(`Message from "${sn}": ${message}`);
            let str = message.replace(/\0/g, '');
            let data = [];
            str.split('|').forEach(d => {
                data.push(d);
            });
            let dev = devices.find(item => item.sn_number === device.sn_number && item.requestDataInterval);
            if(dev){ 
                // rpi asked for the data
                devices[devices.map(device => device.id).indexOf(dev.id)].requestDataInterval = false;
                socket.emit("deviceDataInterval", {device: dev.id, data: data});
                if(!dev.focus){
                    log(`STOP FOR DEVICE ${dev.name}`);
                    radio.send('stopRealTimeData', 10, dev.sn_number).then(() => {
                        log(`stop real time data for device "${sn}"`);
                    }).catch(error => {
                        log(error);
                    })
                }
            } else { 
                // user asked for the data
                if(device.focus)
                socket.emit('realTimeData', {sn_number: sn, data: data});
            }
        }
    }
});

// check connection for each device connected to this hub
/**
 *
 * @param {*} device
 */
const checkConnected = device => {
    return new Promise((resolve, reject) => {
        radio.send('hi', 10, device.sn_number).then(() => {
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

// request realtime data from devices
function requestRealTimeDataFromAllDevices() {
    recursivePromises(0, requestRealTimeData);
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
    recursivePromises(0, stopRequestRealTimeData);
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
function recursivePromises(i, promiseToDo) {
    if (i < devices.length) {
        const dev = devices[i];
        i++;
        promiseToDo(dev).then(() => {
            recursivePromises(i, promiseToDo);
        }).catch(error => {
            // log(error)
            recursivePromises(i, promiseToDo);
        });
    } else {
        return;
    }
}

/**
 *
 */
function checkAllDevices() {
    recursivePromises(0, checkConnected);
}

// {
//     name: 'dht',
//     device_id: 4,
//     {
//         h: 75,
//         t: 32
//     }
// };
