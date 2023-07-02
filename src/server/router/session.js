const express = require('express');
const router = express.Router();
const DEBUG = require('../middlewares/log')
const USER = require('../controllers/users')
const SESSION = require('../controllers/sessions')
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

passport.use(
    new GitHubStrategy(
        {
            clientID: '39b586b3a08bf8c9ea82',
            clientSecret: '814e1d7ab47b52f74b9ca56638eec48c279c1e22',
            callbackURL: 'https://192.168.100.29:3000/session/auth/github/callback'
        },
        (accessToken, refreshToken, profile, done) => {

            console.log(profile)
            // Aqui você pode tratar a resposta do GitHub após a autenticação
            // profile conterá as informações do usuário autenticado
            // done é uma função de callback para continuar o fluxo da autenticação
        }
    )
);


router.use(passport.initialize());


router.post('/', async (req, res) => {
    try {
        let { email, password } = req.body


        if (!email || !password) return res.status(401).send()

        let login = await USER.login(email, password)

        if (!login) return res.sendStatus(401)

        token = await SESSION.newSession(login)

        res.send(token)

        DEBUG('sr-only', [email, password, token])
    } catch (err) {
        DEBUG('error', err)
        res.status(409).send(String(err))
    }
})

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback',
    passport.authenticate('github'),
    (req, res) => {
        // A autenticação foi bem-sucedida, redirecione o usuário para a página desejada
        console.log('sucesso')
        res.send(200)
    }
);



module.exports = async (app) => app.use('/session', router)