const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()


async function list() {
    try {
        let response = await prisma.RSSnewsknow.findMany()
        return (response)
    } catch (err) {
        throw new Error(err)
    }
}


module.exports = { 
    list, 
}