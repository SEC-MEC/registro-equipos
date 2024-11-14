import prisma from "../../../config/db.js";
import os from 'os';
import si from 'systeminformation';


export const createEquipo = async (req, res) => {
    const {
        nombre,
        nro_serie,
        id_inventario,
        tipo,
        observaciones,
        dominio,
        id_oficina,
        id_tecnico,
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
                    modificado:{
                        create:{
                            fecha: new Date(),
                            id_tecnico: parseInt(id_tecnico)
                        }
                    },
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



export const getInfoEquipo = async (req, res) => {  
    try {
        const pcName = os.hostname();
        const userName = os.userInfo().username;
        const systemInfo = await si.system();
        const serialNumber = systemInfo.serial;

        const exisPcName = await prisma.equipo.findFirst({
            where: { nombre: pcName },
        });
        if(exisPcName){
            return res.status(400).json({ error: "El nombre de equipo ya existe" });
        }
        const exisSerialNumber = await prisma.equipo.findFirst({
            where: { nro_serie: serialNumber },
        });
        if(exisSerialNumber){
            return res.status(400).json({ error: "El número de serie ya existe" });
        }
      
        const result = await prisma.equipo.create({
            data:{
                nombre: pcName,
                nro_serie: serialNumber,
                tipo: "PC",
                oficina:{
                    create:{
                        piso
                    }
                },
                equipo_usuario:{
                    create:{
                        nombre: userName ? userName : "Sin usuario"
                    }
                }
            }
        })
        return res.json({success: "Equipo registrado con éxito", result})
    } catch (error) {
        console.log(error)
    }
}