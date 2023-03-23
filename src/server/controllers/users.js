const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


async function createNewUser(data){

    try{
        console.log(data)

        const { name, email, password } = data;
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password
            }
        })
        

        return(user)

    }catch(err){
        res.status(400).json({error: 'Error creating new user'})
    }

}

module.exports = {createNewUser}