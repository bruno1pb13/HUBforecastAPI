try{

    const server = require('./server')


    if(!server.start()){
        throw new Error('Server could not start')
    }
    

}catch(err){
    console.log(err);
}