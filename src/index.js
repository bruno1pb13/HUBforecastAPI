
const garbageCollector = require('./server/controllers/garbageCollector')

const removeIndirectLoginTokenAfterOneHour = ()=>{
    console.log('garbage collector running...')

    garbageCollector.indirectLoginToken(1)
    garbageCollector.connectedDevices(1)
    setInterval(()=>{

        garbageCollector.indirectLoginToken(60 * 60 * 1000)
        garbageCollector.connectedDevices(60 * 60 * 1000)

    }, 1000 * 60 * 60)
}


try{
    require('dotenv').config()

    const server = require('./server')

    removeIndirectLoginTokenAfterOneHour()

    if(!server.start()){
        throw new Error('Server could not start')
    }
    

}catch(err){
    console.log(err);
}