const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()
var jwt = require('jsonwebtoken');

function newSession(data){

  console.log('newSession', process.env.JWT_SECRET)

    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        data: data
      }, process.env.JWT_SECRET);
}

module.exports = {newSession}