const zmq = require("zeromq");
const sock = zmq.socket("pub");

sock.bindSync("tcp://127.0.0.1:3000");
console.log("Publisher bound to port 3000");

// server send its system time to client every 1000 ms
setInterval(function() {
    let today = new Date();
    console.log("sending a multipart message envelope");
    sock.send(["time", today.getTime()]);
}, 1000);
