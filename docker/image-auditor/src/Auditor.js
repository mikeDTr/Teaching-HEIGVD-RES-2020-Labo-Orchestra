//Variables
const protocol = require('./protocol');
const dgram = require('dgram');
const net = require('net');
var moment = require("moment");
const socket = dgram.createSocket('udp4');


Musiciens = new Map();

const INSTRUMENTS_SOUNDS = new Map();
INSTRUMENTS_SOUNDS.set("ti-ta-ti","piano");
INSTRUMENTS_SOUNDS.set("pouet","trumpet");
INSTRUMENTS_SOUNDS.set("trulu","flute");
INSTRUMENTS_SOUNDS.set("gzi-gzi","violin");
INSTRUMENTS_SOUNDS.set("boum-boum","drum");

class Musicien {
    constructor(uuid, instrument, activeSince) {
        this.uuid = uuid;
        this.instrument = instrument;
        this.activeSince = activeSince;
    }
}

socket.bind(protocol.UDP_PORT, function() {
    console.log("New auditor");
    socket.addMembership(protocol.MULTICAST_ADDRESS);
});


socket.on('message', function(message, source) {
	
    console.log("Received : \n"
    + message);

    var payload = JSON.parse(message);
	Musiciens.set(payload.id,new Musicien(payload.uuid,INSTRUMENTS_SOUNDS.get(payload['sound']),moment().format("YYYY-MM-DD HH:mm:ss")));

});


tcp_server = net.createServer(onConnection);
tcp_server.listen(protocol.TCP_PORT);

function onConnection(socket){
    var musiciansList = [];
    
	for([key,value] of Musiciens){
        musiciansList.push(value);
    }

    socket.write(JSON.stringify(musiciansList));
    socket.destroy();
}

 function isStillActive(){
     for([key,value] of Musiciens){
         var currentTime = moment(), LastTimeActive = moment(value.activeSince);

         if(moment.duration(currentTime.diff(LastTimeActive)).as("seconds") > 5){
             Musiciens.delete(key);
         }
     }
 }

 setInterval(isStillActive,1000);