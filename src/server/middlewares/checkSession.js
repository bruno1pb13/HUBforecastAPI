
var jwt = require('jsonwebtoken');


async function checkSession(req, res, next){
    try{

        let {token} = req.cookies
        if(!token) return res.sendStatus(404)
        
        
        let decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        
        if(!decoded) return
        
        
        req.userId = decoded.data.id
        
        
        //generate new token
        let newToken = jwt.sign({data: decoded.data}, process.env.JWT_SECRET, { expiresIn: '1h' })
        
        
        req.payload = {'token': newToken}

        next()
    }catch(err){
        console.log(err)
        return res.sendStatus(401)
    }
}

module.exports = {checkSession}
