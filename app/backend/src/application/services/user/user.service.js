import { registerUserRepository, findUserByNameRepository } from "../../../infraestructure/repository/usuarios/prisma-user.repository.js";
import bcrypt from 'bcryptjs';

export const registerService = async ( userData ) => {
    try {
        const exist = await findUserByNameRepository(userData);
        if(exist){
            return {success: false, message: "El usuario ya existe"}
        }
        const data = await registerUserRepository(userData);

        return {success:true, message:"Usuario creado con éxito", data}
    } catch (error) {
        return {success: false, message: error.message}  
    }
}

export const updatePassowrdService = async (id, pass) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(pass, salt)
        const data = await updatePassowrdRepository(id, hashPassword);
        return {success:true, message:"Contraseña actualizada con éxito", data}
    } catch (error) {
        return {success: false, message: error.message}
    }
}


