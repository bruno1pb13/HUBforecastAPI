const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

async function indirectLoginToken() {
    try {

        console.log('garbage collector running...')

        //remove all tokens with more than 1 hour

        let data = await prisma.indirectLogin.deleteMany({
            where: {
                createdAt: {
                    lt: new Date(Date.now() - 1000 * 60 * 60)
                }
            }
        })

        if (!data) return false
        return true
    } catch (err) {
        throw new Error(err)
    }
}

module.exports = {indirectLoginToken}