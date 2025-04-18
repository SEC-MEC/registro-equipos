
import { UpdateEquipoData } from "@/interface/Equipo";
import clienteAxios from "../config/axios";



export const getEquipos = async () => {
    try {
        const res = await clienteAxios.get('/get')
        return res.data
    } catch (error) {
        console.log("Error en la obtencion de equipos: ", error)
    }
}

export const getEquiposById = async (id_equipo: string) => {
    try {
        const res = await clienteAxios.get(`/equipo/${id_equipo}`)
        return res.data
    } catch (error) {
        console.log("Error en la obtencion de equipos: ", error)
    }
}   


export const createEquipo = async (data: any) => {
    try {
        const res = await clienteAxios.post('/create', data)
        return res.data;
    } catch (error: any) {
        console.log("Error en la creacion de equipos: ", error);
        throw error.response ? error.response.data : new Error("Error en la creacion de equipos");
    }
}

export const generateEquipoName = async (nombre: string): Promise<string> => {
    try {
        const response = await clienteAxios.post('/generate-name', { nombre });
        return response.data.generatedName;
    } catch (error: any) {
        console.error("Error al generar el nombre del equipo:", error);
        throw error.response ? error.response.data : new Error("Error al generar el nombre del equipo");
    }
}

export const getInfoPc = async (data: { id_oficina: string; id_tecnico: any }) => {
    try {
        const res = await clienteAxios.post("/pcInfo", data)
        return res.data
    } catch (error : any) {
        console.error("Error al generar el nombre del equipo:", error);
        throw error.response ? error.response.data : new Error("Error al generar el nombre del equipo");
    }
}

export const createName = async (data: { nombre: string }) => {
    try {
        const res = await clienteAxios.post("/create-name", data)
        return res.data
    } catch (error: any) {
        console.error("Error al generar el nombre del equipo:", error);
        throw error.response ? error.response.data : new Error("Error al generar el nombre del equipo");
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

export const getAplicacionesById = async (id: string) => {
    try {
        const res = await clienteAxios.get(`/aplicaciones/${id}`)
        return res.data
    } catch (error) {
        console.log("Error en la obtencion de aplicaciones: ", error)
    }
}

export const getAplicaciones = async () => {
    try {
        const res = await clienteAxios.get(`/aplicaciones`)
        return res.data
    } catch (error) {
        console.log("Error en la obtencion de aplicaciones: ", error)
    }
}


export const updateEquipo = async (id: number, data: UpdateEquipoData) => {
    try {
        const res = await clienteAxios.put(`/update/${id}`, data)
        return res.data
    } catch (error: any) {
        console.log("Error en la actualizacion de equipos: ", error)
    }
}


export const deleteEquipo = async(id: number) => {
    try {
        const res = await clienteAxios.delete(`/delete/${id}`)
        return res.data
    } catch (error: any) {
        console.log("Error en la eliminacion de equipos: ", error)
    }
}