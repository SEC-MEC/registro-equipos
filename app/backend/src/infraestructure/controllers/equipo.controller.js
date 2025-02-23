import { createEquipoService, generarNombreEquipoService } from "../../application/services/equipo/equipo.service.js";




export const createEquipoHandler = async (req, res) => {

    const {
            nombre,
            nro_serie,
            id_inventario,
            tipo,
            observaciones,
            dominio,
            id_oficina,
            id_tecnico,
            aplicaciones,
            equipo_usuario,
        } = req.body;

        const equipoData = {
            nombre,
            nro_serie,
            id_inventario,
            tipo,
            observaciones,
            dominio: Boolean(dominio),
            id_oficina: parseInt(id_oficina, 10),
            id_tecnico: parseInt(id_tecnico, 10),
            aplicaciones: aplicaciones || [],
            equipo_usuario: equipo_usuario || "N/A",
        };


    const response = await createEquipoService(equipoData);

    if(response.success){
        return res.status(200).json(response)
    }else{
        return res.status(400).json(response.message)
    }

}


export const generateNameHandler = async (req, res) => {
    try {
        const { nombre } = req.body;

       const response = await generarNombreEquipoService(nombre);
       
        if(response.success){
            return res.status(200).json(response.data)
        }else{
            return res.status(400).json(response.message)
        }
    } catch (error) {
        return { success: false, message: error.message };
    }

}