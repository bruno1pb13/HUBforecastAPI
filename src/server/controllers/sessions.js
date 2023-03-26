const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()
var jwt = require('jsonwebtoken');

function newSession(mail, pass){
    
}

module.exports = {newSession}