const socket = require('socket.io-client')('http://felix.local:5000');
const {log} = require('console');
const Transmitter = require('./modules/transmitter')

const device_info = {
    sn_number: 'aNLWTgH&$^k_L2jN'
};

socket.on('connect', () => {
    log('connected');
    socket.emit('device_connect', device_info);
});

socket.on('toDevice', message => {
    log(message);
});

const radio = new Transmitter();

radio.setReadingPipe('0xABCDABCD71');

radio.begin();

radio.read(data => {
    log(data);
});
