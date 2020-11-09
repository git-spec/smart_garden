const socket = require('socket.io-client')('http://felix.local:5000');
const Transmitter = require('./modules/transmitter');
const {log} = require('console');

// [
// {
//     id: 0,
//     name: "name",
//     sn_number: "0xABCDABCDABCD",
//     user_id: 1,
//     hub_id: 5,
//     connected: 1
// },....
// ]

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
});

// list of all devices in the cloud
let devices = [];
socket.on('toDevice', receivedDevices => {
    // log(receivedDevices);
    // save received devices to devices array
    devices = receivedDevices;
});

const radio = new Transmitter();
radio.setReadingPipe('0xABCDABCD71');

// user is online now
socket.on('user_connect', () => {
    // send order to all devices to get realtime data
    log('The user is online now & asking for realtime data');
    //requestRealTimeDataFromAllDevices();
});

socket.on('user_disconnect', () => {
    stopRequestRealTimeDataFromAllDevices();
});

// incoming order for realtime date
socket.on('realTimeRequest', sn => {
    // log(sn);
    radio.send('realTimeData', 10, sn).then(() => {
        log(`Real time request sent to "${sn}"`);
    }).catch(error => {
        log(error);
    });
});

/**
 * test to send order data request to AR c
 *
 */
//radio.send("realTimeData", 10, "0x744d52687C").then(()=>{log("request data sent")})
radio.read(data => {
    // log('sent data from arduino: ', data);
    const sn = data.substr(0, data.indexOf('-'));
    const message = data.substr(data.indexOf('-') + 1, data.length);
    const device = devices.find(device => device.sn_number === sn);
    if (device && message) {
        // message hi???
        if (message.toString().replace(/\x00/gi, '') === 'yup') { 
            // device is connected 
            // set the device from which the data was received to connected
            devices[devices.map(device => device.sn_number).indexOf(sn)].connected = true;
            // send the info back to the server
            // ??????????????????????????????
            // socket.emit('device_connect', sn);
        } else { 
            // device is sending realtime data
            log(`Message from "${sn}": ${message}`);
            let str = message.replace(/\0/g, '');
            let data = [];
            str.split('|').forEach(d => {
                data.push(d);
            });
            // send the data back to the server
            socket.emit('realTimeData', {sn_number: sn, data: data});
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

//{
//     name: 'dht',
//     device_id: 4,
//     {
//         h: 75,
//         t: 32
//     }
// };
