import clienteAxios from "@/config/axios";


export const update = async (data: any, id: string) => {
    try {
        const res = await clienteAxios.put(`/update/${id}`, data)
        return res.data;
    } catch (error: any) {
        console.log("Error en la actualizacion de equipos: ", error);
        throw error.response ? error.response.data : new Error("Error en la actualizacion de equipos");
    }
}

export const updateApp = async (data: any, id: string) => {
    try {
        const res = await clienteAxios.put(`/update-app/${id}`, data)
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