import prisma from "../../../config/db.js";



export const createEquipo = async (req, res) => {   
    const {nombre, nro_serie, id_inventario, oficina, dominio, observacion} = req.body;
    try {
        const equipo = await prisma.equipo.create({
            data:{
                nombre: nombre,
                nro_serie: nro_serie,
                id_inventario: id_inventario,
                oficina: oficina,
                dominio: dominio,
                observacion: observacion

            }
        })
        return res.json({success: "Equipo creado con éxito", equipo})
    } catch (error) {
        console.log(error)
    }
}