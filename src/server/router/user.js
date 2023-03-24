const express = require('express');
const router = express.Router();
const DEBUG = require('../middlewares/log')
const USER = require('../controllers/users')

router.put('/', async (req,res)=>{
    try{
        let user = await USER.createNewUser(req.body)
        
        DEBUG('sr-only', user)
        
        res.json(user)
    }catch(err){
        DEBUG('error', err)
        res.status(409).send(String(err))
    }
})

router.get('/active', async (req,res)=>{
    try{

        let active = await USER.activeUser(req.query)

        if(active){
            return res.status(200).send(active)
        }

    }catch(err){
        DEBUG('error', err)
        res.sendStatus(400)
    }
})

module.exports = async (app) => app.use('/user', router)