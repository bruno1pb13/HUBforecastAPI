const express = require('express');
const app = express();
const port = process.env.PORT || 3000
const cors = require('cors')
const fs = require("fs");
const https = require("https");
app.use(express.json())

app.use(cors({
    origin: process.env.ALLOW_ORIGIN || '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true
}))


if (process.env.ENVIRONMENT == 'dev') {
    const key = fs.readFileSync("192.168.100.29-key.pem", "utf-8");
    const cert = fs.readFileSync("192.168.100.29.pem", "utf-8");
}


let server = {
    info: {
        status: 'closed',
        startTime: null,
        ALLOW_ORIGIN: process.env.ALLOW_ORIGIN
    },

    start: () => start(),
}

function start() {


    require('./router')(app)

    if (process.env.ENVIRONMENT == 'dev') {
        const key = fs.readFileSync("192.168.100.29-key.pem", "utf-8");
        const cert = fs.readFileSync("192.168.100.29.pem", "utf-8");

        return https.createServer({ key, cert }, app).listen(port)
    }
    app.listen(port)
        .on('listening', () => {
            console.log(`Example app listening on port ${port}!`);
            server.info = {
                status: 'listening',
                startTime: new Date()
            }

        })

        .on('close', () => {
            console.log('Server closed')
            server.status = 'closed'
        })

        .on('error', (err) => {
            server.status = 'error'
            throw new Error(err)
        })




    return true
}


module.exports = server