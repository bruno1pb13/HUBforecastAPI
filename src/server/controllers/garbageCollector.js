const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

async function indirectLoginToken(time) {
    try {


        let data = await prisma.indirectLogin.deleteMany({
            where: {
                createdAt: {
                    lt: new Date(Date.now() - time)
                }
            }
        })

        if (!data) return false
        return true
    } catch (err) {
        throw new Error(err)
    }
}

async function connectedDevices(time) {
    try {

        let data = await prisma.connectedDevices.deleteMany({
            where: {
                createdAt: {
                    lt: new Date(Date.now() - time)
                }
            }
        })

        if (!data) return false
        return true
    } catch (err) {
        throw new Error(err)
    }
}

module.exports = {indirectLoginToken, connectedDevices}