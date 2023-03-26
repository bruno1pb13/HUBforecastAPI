const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()
const DEBUG = require('../middlewares/log')


async function list(user) {

    try {

        let response = await prisma.panels.findMany({
            where: {
                userId: user
            }
        })

        return (response)


    } catch (err) {
        
        throw new Error(err)

    }

}

async function create(userId, displayName){
    try {

        let response = await prisma.panels.create({
            data: {
                userId: userId,
                name: displayName
            }
        })

        return (response)


    } catch (err) {
        
        throw new Error(err)

    }
}
module.exports = { list, create }