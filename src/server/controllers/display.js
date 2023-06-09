const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()
const DEBUG = require('../middlewares/log')
const news = require('../controllers/news')


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

async function checkOwner(id, user){
    try {
        let response = await prisma.panels.findUnique({
            where: {
                id: id
            }
        })

        if(response.userId != user){
            throw new Error('User is not owner of display')
        }

        return (response)
    } catch (err) {
        throw new Error(err) 
    }
}

async function create(userId, displayName){
    try {

        //check if this user already has a panel with same name
        let response = await prisma.panels.findMany({
            where: {
                userId: userId,
                name: displayName
            }
        })

        if(response.length > 0){
            throw new Error(JSON.stringify({message: 'User already has a panel with this name', code: 400}))
        }

        response = await prisma.panels.create({
            data: {
                userId: userId,
                name: displayName
            }
        })

        return (response)
    } catch (err) {
        throw (err)
    }
}

async function update(userId, data){


    try {
        let response = await prisma.panels.update({
            where: {
                id: userId
            },
            data: {
                geo: {
                    lat: data.lat,
                    lon: data.lon
                }
            }
        })

        console.log(response)


        return (response)
    } catch (err) {
        throw new Error(err) 
    }
}

async function get(id, options){
    try {
        let response = await prisma.panels.findUnique({
            where: {
                id: id
            }
        })

        if(options.includeConnectedDevices){
            response.connectedDevices = await prisma.connectedDevices.findMany({
                where: {
                    panelId: id
                }
            })
        }

        // get RSS feed
        let NEWS = await news.list(id)

        return ({...response, NEWS})
    } catch (err) {
        throw new Error(err) 
    }
}

async function newDevice(displayId, socketConnectionId){
    try{

        //check if device is already registered
        let device = await prisma.connectedDevices.upsert({
            where: {
                socketId : socketConnectionId
            },
            update: {
                panelId: displayId
            },
            create: {
                socketId: socketConnectionId,
                panelId: displayId
            }
        })

        if(!device){
            throw new Error('Error creating new device')
        }
        return device

    }catch(err){
        throw new Error(err)
    }
}

async function removeDevice(socketConnectionId){
    try{

        //check if device is already registered
        let device = await prisma.connectedDevices.delete({
            where: {
                socketId : socketConnectionId
            }
        })

        return device

    }catch(err){
        console.log('Error removing device')    }
}





module.exports = { 
    list, 
    create, 
    update, 
    get, 
    newDevice, 
    checkOwner,
    removeDevice, 
}