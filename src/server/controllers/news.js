const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()


async function list(display) {
    try {

        let response

        display ? 
        response = await prisma.DisplayNewsFeed.findMany({
            where: {
                panelId: display 
            }
        }) : response = await prisma.RSSnewsknow.findMany()

        return (response)
    } catch (err) {
        throw new Error(err)
    }
}

async function register(painel, data){
    try{


        //return all rss in painel

        let response = await prisma.DisplayNewsFeed.findMany({
            where: {
                panelId: painel
            }
        })

        //check if data.link is already in painel url

        for(let i = 0; i < data.length; i++){

            let check = response.filter((item)=>{
                return item.url == data[i].link
            })
            

            if(check.length == 0){
                response = await prisma.DisplayNewsFeed.create({
                    data: {
                        panelId: painel,
                        url: data[i].link,
                        icon: data[i].icon || null,
                        title: data[i].title,
                    }
                })

            }
        }

        return true

    }catch(err){
        throw new Error(err)
    }
}

async function remove(ids){
    try{
        let response = await prisma.DisplayNewsFeed.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        })
        return response
    }catch(err){
        throw new Error(err)
    }
}
module.exports = { 
    list,
    register,
    remove 
}