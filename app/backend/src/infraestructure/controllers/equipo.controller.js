import { createEquipoService } from "../../application/services/equipo/equipo.service.js";




export const createEquipoHandler = async (req, res) => {

    const {nombre, nro_serie, id_inventario, tipo, observaciones, dominio, id_oficina, id_tecnico, aplicaciones, equipo_usuario} = req.body;


    const response = await createEquipoService({nombre, nro_serie, id_inventario, tipo, observaciones, dominio, id_oficina, id_tecnico, aplicaciones, equipo_usuario}); 

    if(response.success){
        return res.status(200).json(response)
    }else{
        return res.status(400).json(response)
    }

}