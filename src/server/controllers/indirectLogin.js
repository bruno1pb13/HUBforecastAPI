const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

function indirectLogin(){
    async function register(token, socketConnectionId){
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

    async function teste(token){
        try{

            token = token.replace(/\W/g, '')

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

    async function remove(id){
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

    return {register, teste, remove}
}

module.exports = indirectLogin