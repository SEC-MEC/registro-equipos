
import clienteAxios from "../config/axios";



export const getEquipos = async () => {
    try {
        const res = await clienteAxios.get('/get')
        return res.data
    } catch (error) {
        console.log("Error en la obtencion de equipos: ", error)
    }
}


export const createEquipo = async (data: any) => {
    try {
        const res = await clienteAxios.post('/equipo', data)
        return res.data
    } catch (error) {
        console.log("Error en la creacion de equipos: ", error)
    }
}

export const getOficinas = async () => {
    try {
        const res = await clienteAxios.get('/oficinas')
        return res.data
    } catch (error) {
        console.log("Error en la obtencion de oficinas: ", error)
    }
}