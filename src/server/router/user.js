const express = require('express');
const router = express.Router();
const DEBUG = require('../middlewares/log')
const USER = require('../controllers/users')


//create new user
router.put('/', async (req, res) => {
    try {
        let user = await USER.createNewUser(req.body)

        DEBUG('sr-only', user)

        res.json(user)
    } catch (err) {
        DEBUG('error', err)
        res.status(409).send(String(err))
    }
})

//active pending user
router.get('/active', async (req, res) => {
    try {

        let active = await USER.activeUser(req.query)

        if (active) {
            return res.status(200).send(active)
        }

    } catch (err) {
        DEBUG('error', err)
        res.sendStatus(400)
    }
})

//ban user
router.post('/ban', async (req, res) => {
    try {

        let { email } = req.body

        if (!email) throw new Error('email is required')

        if (req.query.unban) {
            let unban = await USER.unbanUser(email)
            if (unban) {
                return res.status(200).send(unban)
            }
            return
        }

        let ban = await USER.banUser(email)

        if (ban) {
            return res.status(200).send(ban)
        }
    } catch (err) {
        DEBUG('error', err)
        res.sendStatus(400)
    }
})

router.get('/recoveryPassword', async (req, res) => {
    try {

        let { email, token, password } = req.query

        if (!email) throw new Error('email is required')

        if (!token) {

            //send email with token
            let recovery = await USER.generateRecoveryPasswordToken(email)

            if (recovery) {
                return res.status(200).send(recovery)
            }

        } else {
            if(!password) throw new Error('password is required')
           
            //verify token

            let verify = await USER.recoveryPassword(email, token, password)

            if (verify) {
                return res.status(200).send(verify)
            }
        }


    } catch (err) {
        DEBUG('error', err)
        res.status(400).send(String(err))
    }
})



module.exports = async (app) => app.use('/user', router)