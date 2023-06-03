const express = require('express');
const router = express.Router();
const {checkSession} = require('../middlewares/checkSession')
const news = require('../controllers/news')
router.use(checkSession)

router.get('/supported/feed', async (req,res)=>{
    try{
        const data = await news.list()
        res.send(data)
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})

router.get('/:id', async (req,res)=>{
    try{
        const data = await news.list(req.params.id)
        res.send(data)
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})


router.post('/delete', async (req,res)=>{
    try{

        console.log(req.body)

        const data = await news.remove(req.body)
        res.send(data)
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})

router.post('/:id', async (req,res)=>{
    try{
        const data = await news.register(req.params.id, req.body.rss)
        res.send(data)
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})


module.exports = async (app) => app.use('/news', router)