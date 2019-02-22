const zmq = require("zeromq"),
    sock = zmq.socket("sub");

const sys = require("util");
const win = require("node-windows");

sock.connect("tcp://127.0.0.1:3000");
sock.subscribe("time");
console.log("Subscriber connected to port 3000");

let timeSynced = false;

sock.on("message", function(topic, message) {
    let newTime = new Date(parseInt(message));

    if (!timeSynced) {
        setSystemTime(newTime);
        timeSynced = true;
    }

    console.log(
        "received a message related to:",
        topic.toString(),
        ", containing message:",
        message.toString()
    );
});

function setSystemTime(date) {
    // get formatted date and time string to set system time
    let day = date.getDate();
    let month = date.getUTCMonth() + 1;
    let year = date.getFullYear();
    let formattedDate = `${year}-${month}-${day}`;
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let formattedTime = `${hour}:${minute}:${second}`;

    // set system time by executing native commands
    let setServerDate = win.elevate(
        `cmd /c date ${formattedDate}`,
        undefined,
        execCallback
    );

    let setServerTime = win.elevate(
        `cmd /c time ${formattedTime}`,
        undefined,
        execCallback
    );

    console.log("System time has been successfully set to: ", date);
}

function execCallback(error, stdout, stderr) {
    if (error) {
        console.log(error);
    } else {
        console.log(stdout);
    }
}
