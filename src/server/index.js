const express = require('express');
const app = express();
const port = process.env.EXPRESS_PORT || 3000

let server = {
    info: {
        status: 'closed',
        startTime: null,
    },

    start: ()=> start(),
}

app.get('/', (req, res) => {
  res.send('Hello World!');
});


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