const express = require('express');
const router = express.Router();
const {checkSession} = require('../middlewares/checkSession')
const news = require('../controllers/news')
router.use(checkSession)

router.get('/feed', async (req,res)=>{
    try{
        const data = await news.list()
        res.send(data)
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})

module.exports = async (app) => app.use('/news', router)