import clienteAxios from "../config/axios";




export const registerRequest = async (user: any) => {
    try {
        const res = await clienteAxios.post('/user', user)
        return res
    } catch (error) {
        console.log("Error en el registro: ", error)
    }
}


export const loginRequest = async (userData: {usuario: string, pass:string}) => {  
    try {
        const res = await clienteAxios.post('/login', userData)
        return res
    } catch (error) {
        console.log("Error en el login: ", error)
    }
}


export const auth = async () => {
    try {
        const res = await clienteAxios.get('/auth')
        return res
    } catch (error) {
        console.log("Error en la autenticacion: ", error)
    }
}

export const changePassword = async (data: {oldPass: string, newPass: string}) => {
    try {
        const res = await clienteAxios.put('/changePassowrd', data)
        return res
    } catch (error) {
        console.log("Error en el cambio de contraseña: ", error)
    }
}