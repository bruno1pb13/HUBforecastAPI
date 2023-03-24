
const fs = require('fs');
const path = require('path')
var error = fs.createWriteStream(path.join('./log/error.txt' ), { flags: 'a' });
var access = fs.createWriteStream(path.join('./log/access.txt' ), { flags: 'a' });


function DEBUG(type, msg){

    if(process.env.ENVIRONMENT == 'dev'){
        console.log(`[${type}] ${msg}`)
    }

    //save in logfile

    switch(type){
        case 'error':
            error.write('----------------------------------------\n')
            error.write(new Date().toLocaleString() + '\n')
            error.write(`[${type}] ${msg}\n `)
            break;
        case 'access':
            error.write('----------------------------------------\n')
            error.write(new Date().toLocaleString() + '\n')
            access.write(`[${type}] ${msg}\n`)
            break;
        case 'sr-only':
            //only log on terminal
            break;
        default:
            break;
    }
}

module.exports = DEBUG