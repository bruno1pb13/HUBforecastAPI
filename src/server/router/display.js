const express = require('express');
const router = express.Router();
const display = require('../controllers/display')
const {checkSession} = require('../middlewares/checkSession')

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

module.exports = async (app) => app.use('/display', router)