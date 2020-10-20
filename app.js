const socket = require("socket.io-client")("http://felix.local:5000");
const {log} = require("console")


const device_info = {
    sn_number: "aNLWTgH&$^k_L2jN"
}




socket.on("connect", () => {
    log("connected")
    socket.emit("device_connect", device_info);
})


socket.on("toDevice", message=>{
    log(message)
})
