
//variables
var dgram = require('dgram');
const { v4: uuidv4 } = require('uuid');
var protocol = require('./protocol');
var socket = dgram.createSocket('udp4');
var instrument = process.argv[2];

const SOUNDS = new Map();
SOUNDS.set("piano", "ti-ta-ti");
SOUNDS.set("trumpet", "pouet");
SOUNDS.set("flute", "trulu");
SOUNDS.set("violin", "gzi-gzi");
SOUNDS.set("drum", "boum-boum");

function Musician() {

    this.id = uuidv4();
    this.sound = SOUNDS.get(instrument);

    Musician.prototype.update = function() {
        var measure = {
            uuid        : this.id,
            sound  : this.sound,
        };

        const payload = JSON.stringify(measure);
        const message = Buffer.from(payload);

        socket.send(message, 0, message.length, protocol.UDP_PORT,
            protocol.MULTICAST_ADDRESS, function(err, bytes) {
                console.log("Payload : " + payload);
            });
    };

    setInterval(this.update.bind(this), 1000);
}

new Musician(instrument);