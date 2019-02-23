const zmq = require("zeromq");
const sock = zmq.socket("sub");

const sys = require("util");
const win = require("node-windows");

let timeBefore = new Date().getTime();

// RTT is the execution time of below 2 lines
sock.connect("tcp://127.0.0.1:3000");
sock.subscribe("time");
let timeAfter = new Date().getTime();
let RTT = timeAfter - timeBefore;
console.log("Subscriber connected to port 3000");
console.log("Calculated RTT is: " + RTT);

let timeSynced = false;

sock.on("message", function(topic, message) {
    if (!timeSynced) {
        console.log("server time received: " + message);
        // calculate new time using server time + RTT / 2
        let newTime = new Date(parseInt(message) + RTT / 2);
        setSystemTime(newTime);

        // we only need to sync once
        timeSynced = true;
    } else {
        console.log("clock has been synced successfully, closing socket now");
        sock.close();
        process.exit(0);
    }
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
