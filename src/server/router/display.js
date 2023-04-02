const express = require('express');
const router = express.Router();
const display = require('../controllers/display')
const {checkSession} = require('../middlewares/checkSession')

let socket = ''

//list display
router.get('/', checkSession, async (req,res,next)=>{
    try{

        let response = await display.list(req.userId)

        if(req.payload) response = {response, ...req.payload}
        res.send(response)
    }catch(err){
        res.status(500).send(String(err))
    }
})

//new display
router.put('/', checkSession, async (req,res,next)=>{
    try{

        let {name} = req.body
        if(!name) return res.status(400).send('Require field: name')

        let response = await display.create(req.userId, name)

        if(req.payload) response = {response, ...req.payload}
        res.send(response)

    }catch(err){
        res.status(500).send(String(err))
    }
})

//update display
router.post('/', checkSession, async (req,res,next)=>{
    try{

        let {id, geo} = req.body

        
        if(!id || !geo) return res.status(400).send('Require fields: id, geo')
        
        let response = await display.update(id, geo)

        socket.to(id).emit('updateWeather', geo)

        if(req.payload) response = {response, ...req.payload}
        res.send(response)

    }catch(err){
        console.log(err)
        res.status(500).send(String(err))
    }
})

router.get('/:id', async (req,res,next)=>{
    try{

        let {id} = req.params
        if(!id) return res.status(400).send('Require field: id')

        includeConnectedDevices = req.query.include?.includes("connectedDevices")
        
        let response = await display.get(id, {
            includeConnectedDevices: includeConnectedDevices
        })

        res.send(response)
    }catch(err){
        console.log(err)
        res.status(500).send(String(err))
    }
})

module.exports = async (app, io) => {
    app.use('/display', router)
    socket = io
}