
const fs = require('fs');
const path = require('path')


function DEBUG(type, msg){
    console.log(`[${type}] ${msg}`)

    if(process.env.ENVIRONMENT == 'dev'){

        var error = fs.createWriteStream(path.join('./log/error.txt' ), { flags: 'a' });
        var access = fs.createWriteStream(path.join('./log/access.txt' ), { flags: 'a' });

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

    //save in logfile

    
}

module.exports = DEBUG