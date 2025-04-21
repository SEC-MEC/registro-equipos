import clienteAxios from "@/config/axios";
import axios from "axios";

export const update = async (data: any, id: string) => {
    try {
        const res = await clienteAxios.put(`/update/${id}`, data)
        return res.data;
    } catch (error: any) {
        console.log("Error en la actualizacion de equipos: ", error);
        throw error.response ? error.response.data : new Error("Error en la actualizacion de equipos");
    }
}

export const updateApp = async (data: { id_app: number[] }, id: string) => {
    try {
        const res = await axios.put(`${import.meta.env.VITE_SCAN}/equipos/${id}/aplicaciones`, data, { withCredentials: true })
        return res.data;
    } catch (error: any) {
        console.log("Error en la actualizacion de equipos: ", error);
        throw error.response ? error.response.data : new Error("Error en la actualizacion de equipos");
    }
}

export const deleteApp = async ( id: string, id_app: string) => {
    try {
        const res = await clienteAxios.delete(`/delete-app/${id}/${id_app}`)
        return res.data;
    } catch (error: any) {
        console.log("Error en la actualizacion de equipos: ", error);
        throw error.response ? error.response.data : new Error("Error en la actualizacion de equipos");
    }
}

export const getAplicaciones = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SCAN}/aplicaciones`)
        return res.data
    } catch (error) {
        console.log("Error en la obtencion de aplicaciones: ", error)
    }
}