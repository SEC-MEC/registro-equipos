import prisma from "../../orm/prisma.js";
import dotenv from 'dotenv'
dotenv.config() 



export const findUserByNameRepository = async(usuario) => {
    try {
        const user = await prisma.tecnico.findFirst({data: usuario})
        return user;
    } catch (error) {
        throw new Error("Error al buscar el usuario: " + error.message);  
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

export const registerUserRepository = async(userData) => {

    try {
        const create = await prisma.tecnico.create({data: userData})
        
        return create;

    } catch (error) {
        throw new Error("Error al crear el usuario: " + error.message);
    }

}


export const updatePassowrdRepository = async(id, hashPassword) => {   
    try {
        const update  = await prisma.tecnico.update({
            where:{
                id: Number(id),
            },
            data:{
                pass: hashPassword
            }
        })

        return update;
    } catch (error) {
        throw new Error("Error al actualizar la contraseña: " + error.message);
    }

}