const socket = require('socket.io-client')('http://felix.local:5000');
const {log} = require('console');
const Transmitter = require('./modules/transmitter')

const hub_info = {
    sn_number: '0xABCDABCD71'
};
const devices = [];

socket.on('connect', () => {
    log('connected');
    socket.emit('hub_device_connect', hub_info); // hub_connect?
});

socket.on('toDevice', message => { // devices instead of message
    log(message);
    // save these devices to somewhere... ex: db, file?
});

const radio = new Transmitter();

radio.setReadingPipe('0xABCDABCD71');

radio.read(data => {
    log(data);
});

// radio.send('data from rasbperry', 10, '0x744d52687C').then(() => {
//     console.log('sent');
// }).catch(() => {
//     console.log('error on sending');
// });

// checks every 20 s if a device is connected 
setInterval(() => {
    checkConnected();
}, 20 * 1000);

// for each device related to this hub
function checkConnected() {
    radio.send('hi', 10, '0x744d52687C').then(() => {
        console.log('connected');
        socket.emit('device_connect', '0x744d52687C')
    }).catch(() => {
        console.log('disconnected');
        socket.emit('device_disconnect', '0x744d52687C')
    });
}