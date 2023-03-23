const express = require('express');
const router = express.Router();
const server = require('../index.js')

router.get('/', async (req,res)=>{
    try{
        res.send(server.info)
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})

module.exports = async (app) => app.use('/status', router)