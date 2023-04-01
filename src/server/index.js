const fs = require("fs");
const https = require("https");

const express = require('express');
const app = express();

const port = process.env.PORT || 3000

const cors = require('cors')
const cookieParser = require("cookie-parser");

const {newDevice, removeDevice} = require('./controllers/display')

var options = {
    key: fs.readFileSync('./192.168.100.29-key.pem'),
    cert: fs.readFileSync('./192.168.100.29.pem')
};    

app.use(express.json())
app.use(cookieParser());

app.use(cors({
    origin: process.env.ALLOW_ORIGIN || '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true
}))

var httpServer  = https.createServer(options, app);
const {Server} = require('socket.io')

const io  = new Server(httpServer , {
    cors: {
      origin: process.env.ALLOW_ORIGIN
    }
  });

let server = {
    info: {
        status: 'closed',
        startTime: null,
        ALLOW_ORIGIN: process.env.ALLOW_ORIGIN
    },

    start: () => start(),
}

function start() {


    
    require('./router')(app, io)

    
    io.on('connection', function(socket) {
        console.log('new connection');
        socket.emit('message', 'This is a message from the dark side.');

        socket.on('join', function(data) {

            console.log('?')

            newDevice(data, socket.id)
            .then((response)=>{
                socket.join(data)
                socket.emit('message', 'Connection established');
            })
        })

        socket.on('disconnect', function() {
            console.log('user disconnected');
            removeDevice(socket.id)
        })
    });


    httpServer.listen(port, function() {
        console.log('server up and running at %s port', port);
    });

    return true
}


module.exports = server