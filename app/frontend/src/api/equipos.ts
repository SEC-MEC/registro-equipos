import clienteAxios from "../config/axios";



export const getEquipos = async () => {
    try {
        const res = await clienteAxios.get('/equipos')
        return res.data
    } catch (error) {
        console.log("Error en la obtencion de equipos: ", error)
    }
}


