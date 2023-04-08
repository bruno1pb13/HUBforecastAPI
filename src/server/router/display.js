const express = require('express');
const router = express.Router();
const display = require('../controllers/display')
const {checkSession} = require('../middlewares/checkSession')
const sessions = require('../controllers/sessions')

let socket = ''

//list display
router.get('/', checkSession, async (req,res,next)=>{
    try{
        
        let response = await display.list(req.userId)
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

        if(id == undefined) return res.status(400).send('Require field: id')

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

router.post('/indirectLogin/:id', checkSession, async (req,res,next)=>{

    try{

        let {id} = req.params
        if(!id) return res.status(400).send('Require field: id')
 
        let {token} = req.body
        if(!token) return res.status(400).send('Require field: token')

        //check if screen id in params is owned by user
        let owner = await display.checkOwner(id, req.userId)
        if(!owner) return res.status(400).send('User is not owner of display')


        //check if token is valid
        let indirectDisplay = await display.validIndirectLoginToken(token)
        if(!indirectDisplay) return res.status(400).send('Invalid token')

        //generate a valid token for the display
        let sToken = sessions.newSession({
            id: req.userId,
            displayId: id,
            type: 'display'
        })

        // delete tempToken 
        await display.deleteIndirectLoginToken(indirectDisplay.id)

        socket.to(indirectDisplay.token).emit('indirectLoginGrant', {
            token: sToken,
            displayId: id
        })

        res.sendStatus(200)

    }catch(err){
        console.log(err)
        res.status(500).send(String(err))
    }

})


module.exports = async (app, io) => {
    app.use('/display', router)
    socket = io
}