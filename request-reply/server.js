const zmq = require("zeromq");

var responder = zmq.socket("rep");

responder.on("message", function(request) {
    console.log("Received request: [", request.toString(), "]");

    setTimeout(function() {
        // send time back to client.
        let time = new Date();
        responder.send(time.getTime().toString());
    }, 1000);
});

responder.bind("tcp://*:5555", function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Listening on 5555...");
    }
});

process.on("SIGINT", function() {
    responder.close();
});
