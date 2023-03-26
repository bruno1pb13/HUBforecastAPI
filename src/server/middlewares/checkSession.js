
var jwt = require('jsonwebtoken');


function checkSession(req, res, next){
    let {token} = req.cookies
    if(!token) return res.sendStatus(404)
    
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.data.id

    next()
}

module.exports = {checkSession}
