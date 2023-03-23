const express = require('express');
const router = express.Router();

const USER = require('../controllers/users')

router.put('/', async (req,res)=>{
    try{
        let user = await USER.createNewUser(req.body)
        if(!user){
            res.status(400).json({error: 'Error creating new user'})
        }
        res.json(user)
    }catch(err){

    }
})

module.exports = async (app) => app.use('/user', router)