const socket = require('socket.io-client')('http://felix.local:5000');
const Transmitter = require('./modules/transmitter');
const {log} = require('console');

const hub_info = {
    sn_number: '0xABCDABCD71'
};
// list of all devices in the cloud
let devices = [];

socket.on('connect', () => {
    log('connected');
    socket.emit('hub_connect', hub_info);
    // checking all devices every 20 seconds
    setInterval(() => {
        checkAllDevices();
    }, 20 * 1000)
});

socket.on('toDevice', receivedDevices => {
    // log(receivedDevices);
    // save received devices to devices array
    devices = receivedDevices;
});

const radio = new Transmitter();

radio.setReadingPipe('0xABCDABCD71');

radio.read(data => {
    // log('sent data from arduino: ', data);
    const sn = data.substr(0, data.indexOf('-'));
    const message = data.substr(data.indexOf('-') + 1, data.length);
    const device = devices.find(device => device.sn_number === sn);
    if (device && message) {
        if (message.toString().replace(/\x00/gi, '') === 'hi') {
            // set the device from which data was received to connected
            devices[devices.map(device => device.sn_number).indexOf(sn)].connected = true;
            socket.emit('device_connect', sn);
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