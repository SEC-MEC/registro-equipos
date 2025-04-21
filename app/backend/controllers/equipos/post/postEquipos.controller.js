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

export const createName = async(req, res) => {
    const {nombre} = req.body;
    try {
        const result = await prisma.equipo.create({
            data:{
                nombre: nombre
            }
        })
        return res.json({success: "Nombre creado con éxito", result})
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
        aplicaciones,
        equipo_usuario,
    } = req.body;

    try {
        console.log(req.body)
        const equipo = await prisma.$transaction(async (tx) => {

          
            const nuevoEquipo = await tx.equipo.create({
              data: {
                nombre,
                nro_serie,
                id_inventario,
                tipo,
                observaciones,
                dominio: Boolean(dominio),
                equipo_usuario: {
                  create: {
                    usuario: {
                      create: {
                        nombre: equipo_usuario || "N/A",
                        apellido: equipo_usuario || "N/A",
                        usr: equipo_usuario || "N/A",
                        interno: null,
                      },
                    },
                  },
                },
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
          
            if (aplicaciones && aplicaciones.length > 0) {
              await tx.equipo_app.createMany({
                data: aplicaciones.map((idApp) => {
                    const parsedId = parseInt(idApp, 10);
                    if (isNaN(parsedId)) {
                        throw new Error(`El ID de la aplicación "${idApp}" no es un número válido.`);
                    }
                    return{
                        id_equipo: nuevoEquipo.id,
                        id_app: parsedId
                    }
                  
                }),
              });
            }
          
            return nuevoEquipo;
          });

        return res.json({ success: "Equipo registrado con éxito", equipo });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al crear el equipo" });
    }
};



export const getInfoEquipo = async (req, res) => {
    
    const {id_tecnico, id_oficina} = req.body;
    try {
        const pcName = os.hostname();
        const userName = os.userInfo().username;
        const systemInfo = await si.system();
        const serialNumber = systemInfo.serial;

        const result = await prisma.equipo.create({
            data:{
                nombre: pcName,
                nro_serie: serialNumber,
                tipo: "PC",
                observaciones: userName || "Sin usuario",
                oficina:{
                    connect:{
                        id: parseInt(id_oficina)
                },
                 },
                equipo_usuario:{
                    create:{
                        usuario:{
                            create:{
                                nombre: userName || "Sin usuario"
                            }
                        }
                    }
                },
                modificado:{
                    create:{
                        id_tecnico: parseInt(id_tecnico),
                        fecha: new Date()
                    }
                }
            }
        })
        return res.json({success: "Equipo registrado con éxito", result})
    } catch (error) {
        console.log(error)
    }
}


export const updateEquipos = async (req, res) => {

    const {id} = req.params;
    const {dataToUpdate} = req.body;
    try {

        const filteredData = Object.fromEntries(
            Object.entries(dataToUpdate).filter(([_, v]) => v !== "" && v !== undefined)
          );

        const equipos = await prisma.equipo.update({
            where: {
                id: parseInt(id)
            },
            data: filteredData
        })
        return res.status(200).json(equipos);
    } catch (error) {
        console.log("Error en getEquipos: ", error)
        return res.status(500).json({ error: "Error al actualizar el equipo" });
    }
    }
