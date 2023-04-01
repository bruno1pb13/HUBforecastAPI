const express = require('express');
const router = express.Router();
const DEBUG = require('../middlewares/log')
const USER = require('../controllers/users')
const SESSION = require('../controllers/sessions')

router.post('/', async (req, res) => {
    try {
        let {email, password} = req.body


        if(!email || !password) return res.status(401).send()

        let login = await USER.login(email, password)

        if(!login) return res.sendStatus(401)

        token = await SESSION.newSession(login)
        
        res.send(token)

        DEBUG('sr-only', [email,password, token])
    } catch (err) {
        DEBUG('error', err)
        res.status(409).send(String(err))
    }
})




module.exports = async (app) => app.use('/session', router)