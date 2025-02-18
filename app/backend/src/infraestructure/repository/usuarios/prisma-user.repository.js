import prisma from "../../orm/prisma";
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
dotenv.config() 



export const findUserByNameRepository = async(req, res) => {
    const {usuario} = req.params;
    try {
        const user = await prisma.tecnico.findFirst({
            where:{
                usuario: usuario
            }
        })
        if(!user){
            return res.json({error: "Usuario no encontrado"})
        }
        return res.json(user)
    } catch (error) {
        console.log(error)
    }
} 

export const findUserByIdRepository = async(req, res) => {
    const {id} = req.params;
    try {
        const user = await prisma.tecnico.findFirst({
            where:{
                id: parseInt(id)
            }
        })
        if(!user){
            return res.json({error: "Usuario no encontrado"})
        }
        return res.json(user)
    } catch (error) {
        console.log(error)
    }

}

