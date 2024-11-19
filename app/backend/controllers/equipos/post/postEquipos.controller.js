import { connect } from "http2";
import prisma from "../../../config/db.js";
import os from 'os';
import si from 'systeminformation';


export const existPcName = async(req, res) => {
    const {nombre} = req.body;
    try {
        const result = await prisma.equipo.findFirst({
            where: { nombre: nombre },
        });
        if(result){
            return res.json({exist: true});
        }
    } catch (error) {
        console.log(error)
    }
}

export const generateEquipoName = async (req, res) => {
  const {
      nombre,
  } = req.body;

  try {
      const lastEquipo = await prisma.equipo.findFirst({
          where: {
              nombre: {
                  startsWith: nombre,
              },
          },
          orderBy: {
              nombre: 'desc',
          },
      });

      let generateNum = "001";

      if (lastEquipo) {
          const match = lastEquipo.nombre.match(/-(\d{3})$/);
          if (match) {
              const lastNum = parseInt(match[1], 10);
              generateNum = (lastNum + 1).toString().padStart(3, '0');
          }
      }

      const generateName = `${nombre}-${generateNum}`;

      return res.json({ generatedName: generateName });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al generar el nombre del equipo" });
  }
};

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
        // aplicaciones, //array de objetos
    } = req.body;

    try {
        const equipo = await prisma.$transaction(async (tx) => {

          
            const nuevoEquipo = await tx.equipo.create({
              data: {
                nombre,
                nro_serie,
                id_inventario,
                tipo,
                observaciones,
                dominio,
                modificado:{
                  create:{
                    id_tecnico: parseInt(id_tecnico),
                    fecha: new Date(),
                  }
                },
                oficina: {
                  connect: { id: parseInt(id_oficina) },
                },
              },
            });
          
            // if (aplicaciones && aplicaciones.length > 0) {
            //   await tx.equipo_app.createMany({
            //     data: aplicaciones.map((app) => ({
            //       id_equipo: nuevoEquipo.id,
            //       id_app: app.id_app
            //     })),
            //   });
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