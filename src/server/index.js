const fs = require("fs");
const https = require("https");
const http = require("http");

const express = require('express');
const path = require('path')
const cors = require('cors')
const cookieParser = require("cookie-parser");

const port = process.env.PORT || 3000

const {newDevice, removeDevice, registerIndirectLoginToken} = require('./controllers/display')
const {Server} = require('socket.io')
const {generateToken} = require('./componentes/indirectLoginToken')

const garbageCollector = require('./controllers/garbageCollector')

const app = express();

app.use(express.json())
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')))

app.use(cors({
    origin: process.env.ALLOW_ORIGIN || '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true,
    exposedHeaders: ['x-access-token']
}))

if(process.env.ENVIRONMENT === 'dev'){

    var options = {
        key: fs.readFileSync('./192.168.100.29-key.pem'),
        cert: fs.readFileSync('./192.168.100.29.pem')
    };    
    
    var httpServer  = https.createServer(options, app);
}else{
    var httpServer  = http.createServer(app);
}


const io  = new Server(httpServer , {
    cors: {
      origin: process.env.ALLOW_ORIGIN,
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

async function start() {

    require('./router')(app, io)

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
      });
    
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

        socket.on('indirectLoginToken', function(){

            token = generateToken()

            socket.join(token)

            registerIndirectLoginToken(token, socket.id)
            .then((response)=>{
                socket.emit('indirectLoginToken', token)
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

    const removeIndirectLoginTokenAfterOneHour = setInterval(garbageCollector.indirectLoginToken, 1000 * 60 * 60)

    return true
}


module.exports = server