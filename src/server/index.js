const express = require('express');
const app = express();
const port = process.env.PORT || 3000
const cors = require('cors')
app.use(express.json())
app.use(cors({
    origin: 'http://192.168.100.29:5173',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))

let server = {
    info: {
        status: 'closed',
        startTime: null,
    },

    start: ()=> start(),
}

function start(){


    require('./router')(app)

    app.listen(port)

    .on('listening', () => {
        console.log(`Example app listening on port ${port}!`);
        server.info = {
        status : 'listening',
        startTime : new Date()
        }
        
    })

    .on('close', ()=>{
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