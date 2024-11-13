import prisma from "../../../config/db.js";



export const createEquipo = async (req, res) => {
    const {
        nombre,
        nro_serie,
        id_inventario,
        tipo,
        observaciones,
        dominio,
        id_oficina,
        aplicaciones, //array de objetos
    } = req.body;

    try {
      
        const equipo = await prisma.$transaction(async (prisma) => {

            const existNroSerie = await prisma.equipo.findFirst({
                where: { nro_serie },
            });

            if(existNroSerie){
                return res.status(400).json({ error: "El número de serie ya existe" });
            }
            
            const nuevoEquipo = await prisma.equipo.create({
                data: {
                    nombre: nombre,
                    nro_serie: nro_serie,
                    id_inventario: id_inventario,
                    tipo: tipo,
                    observaciones: observaciones,
                    dominio: dominio,
                    oficina:{
                        
                        connect: {id: parseInt(id_oficina)}
                    },
                },
            });

            // if (aplicaciones && aplicaciones.length > 0) {
            //     await prisma.equipo_app.createMany({
            //         data: aplicaciones.map((app) => ({
            //             id_equipo: nuevoEquipo.id,
            //             id_app: app.id_app,
            //         })),
            //     });
            // }

            return nuevoEquipo;
        });

        return res.json({ success: "Equipo registrado con éxito", equipo });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al crear el equipo" });
    }
};
