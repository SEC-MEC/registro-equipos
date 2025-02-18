import { authRepository, loginRepositorty } from "../../../infraestructure/repository/usuarios/prisma-auth.repository.js";



export const loginService = async (req, res) => {
    try {
        const result = loginRepositorty(req, res);
        return result;
    } catch (error) {
        console.log(error)
    }

}


export const authService = async (req, res) => {
    try {
        const result = authRepository(req, res);
        return result;
    } catch (error) {
        console.log(error)
    }
    
}