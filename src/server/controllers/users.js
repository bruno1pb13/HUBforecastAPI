const { PrismaClient, Prisma  } = require('@prisma/client')
const prisma = new PrismaClient()
const DEBUG = require('../middlewares/log')
const bcrypt = require('bcrypt')

async function createNewUser(data){

    try{

        const { name, email} = data;

        let {password} = data
        password = await cryptPassword(password)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password
            },
            select: {
                id: true,
                name: true,
                status: true,
            }
        })
        console.log(user)

        //create activation code
        if(user){

            const token = Math.floor(100000000000 + Math.random() * 900000000000)

            const code = await prisma.activationCode.create({
                data: {
                    email: email,
                    code: String(token)
                }
            })

            console.log(code)
        }
        

        DEBUG('sr-only', user)
        return(user)


    }catch(err){
        if(err instanceof Prisma.PrismaClientKnownRequestError){
            if (err.code === 'P2002') {
                throw new Error(`There is a unique constraint violation, a new user cannot be created with this ${err.meta.target}`)
            }
        }

        throw new Error(err)
       
    }

}

async function activeUser(data){
    try{
        const { email, code } = data;

    //check if code is valid
    const user = await prisma.activationCode.findUnique({
        where: {
            email: email,
        }
    })

    if(user.code !== code){
        throw new Error('Invalid code')
    }

    //update user status
    const updatedUser = await prisma.user.update({
        where: {
            email: email
        },
        data: {
            status: 'active'
        },
        select: {
            id: true,
            name: true,
            status: true,
            email: true
        }
    })

    return updatedUser

    }catch(err){
        throw err
    }
}

async function cryptPassword(password){
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

module.exports = {createNewUser, activeUser}