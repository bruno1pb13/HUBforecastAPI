const fs = require("fs");
const https = require("https");
const http = require("http");

const express = require('express');
const path = require('path')
const cors = require('cors')
const cookieParser = require("cookie-parser");

const port = process.env.PORT || 3000

const { Server } = require('socket.io')
const socketHandler = require('./socket/socketHandler');

const app = express();

app.use(express.json())
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')))

app.use(cors(
    {
        origin: process.env.ALLOW_ORIGIN || '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        credentials: true,
        exposedHeaders: ['x-access-token'],
        methods: ['GET', 'POST', 'DELETE']
    }
))


if(process.env.ENVIRONMENT == 'dev'){

    var options = {
        key: fs.readFileSync('./key.pem'),
        cert: fs.readFileSync('./cert.pem')
    };
    
    var httpServer = https.createServer(options, app);
}else{
    var httpServer = http.createServer(app);
}



const io = new Server(httpServer, {
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

    app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

    socketHandler(io);

    httpServer.listen(port, function () {
        console.log('server up and running at %s port', port);
    });


    return true
}


module.exports = server