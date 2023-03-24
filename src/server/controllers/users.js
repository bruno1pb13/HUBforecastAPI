const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()
const DEBUG = require('../middlewares/log')
const bcrypt = require('bcrypt')

async function createNewUser(data) {

    try {

        const { name, email } = data;

        let { password } = data
        password = await cryptPassword(password)

        //create user
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

        //create activation code
        if (user) {

            const token = Math.floor(100000000000 + Math.random() * 900000000000)

            const code = await prisma.activationCode.upsert({
                where: {
                    email: email,
                },
                update: {
                    code: String(token)
                },
                create: {
                    email: email,
                    code: String(token)
                }
            })

            console.log(code)
        }


        DEBUG('sr-only', user)
        return (user)


    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                throw new Error(`There is a unique constraint violation, a new user cannot be created with this ${err.meta.target}`)
            }
        }

        throw new Error(err)

    }

}

async function activeUser(data) {
    try {
        const { email, code } = data;

        //check if code is valid
        const user = await prisma.activationCode.findUnique({
            where: {
                email: email,
            }
        })

        if (user.code !== code) {
            throw new Error('Invalid code')
        }

        await prisma.activationCode.delete({
            where: {
                email: email
            }
        })

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

    } catch (err) {
        throw err
    }
}

async function banUser(email){
    try{
        const user = await prisma.user.update({
            where:{
                email: email
            },
            data:{
                status: 'blocked'
            },
            select:{
                id: true,
                status: true,
            }
        })

        return user
    }catch(err){
        throw err
    }
}

async function unbanUser(email){
    try{
        const user = await prisma.user.update({
            where:{
                email: email
            },
            data:{
                status: 'active'
            },
            select:{
                id: true,
                status: true,
            }
        })

        return user
    }catch(err){
        throw err
    }
}

async function generateRecoveryPasswordToken(email){
    try{
        
        const token = Math.floor(100000000000 + Math.random() * 900000000000)

        await prisma.RecoveryPassword.upsert({
            where: {
                email: email,
            },
            update: {
                code: String(token)
            },
            create: {
                email: email,
                code: String(token)
            }
        })

        DEBUG('sr-only', `generated code: ${token} for email: ${email}`)

        return true
    }catch(err){
        throw err
    }
}

async function recoveryPassword(email, token, password){
    try{

        const recoveryPassword = await prisma.RecoveryPassword.findUnique({
            where:{
                email: email
            }
        })

        if(!recoveryPassword) throw new Error('no recovery password request found')


        if(recoveryPassword.token !== String(token)) throw new Error('Invalid token')

        password = await cryptPassword(password)

        await prisma.user.update({
            where:{
                email: email
            },
            data:{
                password: password
            }
        })

        await prisma.RecoveryPassword.delete({
            where:{
                email: email
            }
        })

        return true

    }catch(err){
        throw err
    }
}

async function cryptPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

module.exports = { createNewUser, activeUser, banUser, unbanUser, generateRecoveryPasswordToken, recoveryPassword }