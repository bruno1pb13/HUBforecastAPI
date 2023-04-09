const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()
var jwt = require('jsonwebtoken');

function newSession(data){
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        data: data
      }, process.env.JWT_SECRET);
}

function validSession(token){
    try{
        let decoded = jwt.verify(token, process.env.JWT_SECRET)
        return !!decoded
    }catch(err){
        return false
    }
}

module.exports = {newSession, validSession}