const zmq = require("zeromq");
const sys = require("util");
const win = require("node-windows");

console.log("Connecting to the server...");
var requester = zmq.socket("req");
let requestTime = new Date().getTime();

requester.on("message", function(reply) {
    let serverTime = new Date(parseInt(reply));
    console.log("Server Time got: " + serverTime);
    let receiveTime = new Date().getTime();
    // use the same algorithm as assignment 1, just calculated the time between
    // sending a request and receiving a reply

    let RTT = parseInt(receiveTime) - parseInt(requestTime);
    console.log("caculated RTT: " + RTT);

    let newTime = new Date(parseInt(serverTime.getTime()) + RTT / 2);
    console.log("calculated new time: " + newTime);

    setSystemTime(newTime);
    console.log("clock has been synced successfully, closing socket now");

    requester.close();
    process.exit(0);
});

requester.connect("tcp://localhost:5555");

requester.send("Time");

process.on("SIGINT", function() {
    requester.close();
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
