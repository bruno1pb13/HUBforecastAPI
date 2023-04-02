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

async function update(userId, data){

    console.log(userId, data)

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

        return (response)
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

async function registerIndirectLoginToken(token, socketConnectionId){
    try{

        let device = await prisma.indirectLogin.upsert({
            where: {
                socketId : socketConnectionId
            },
            update: {
                token: token
            },
            create: {
                socketId: socketConnectionId,
                token: token
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

async function validIndirectLoginToken(token){
    try{

        let device = await prisma.indirectLogin.findUnique({
            where: {
                token : token
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

async function deleteIndirectLoginToken(id){
    try{

        let device = await prisma.indirectLogin.delete({
            where: {
                id : id
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




module.exports = { 
    list, create, update, get, 
    newDevice, removeDevice, checkOwner,
    registerIndirectLoginToken, validIndirectLoginToken, deleteIndirectLoginToken }