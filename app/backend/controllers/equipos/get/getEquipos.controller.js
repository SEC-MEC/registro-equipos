import prisma from "../../../config/db.js";

  


  export const getEquipos = async (req, res) => {
    try {
        const equipos = await prisma.vistaEquipos.findMany();
        return res.status(200).json(equipos);
    } catch (error) {
        console.log("Error en getEquipos: ", error)
    }
}

export const getEquiposById = async (req, res) => {
    const { id_equipo } = req.params;
    try {
        const equipo = await prisma.vistaEquipos.findUnique({
            where: {
                id_equipo: parseInt(id_equipo)
            }
        });
        return res.status(200).json(equipo);
    } catch (error) {
        console.log("Error en getEquiposById: ", error)
    }
}



export const getOficinas = async (req, res) => {    
    try {
        const oficinas = await prisma.oficina.findMany();
        return res.status(200).json(oficinas);
    } catch (error) {
        console.log("Error en getOficinas: ", error)
    }
}

export const getAplicacionesById = async(req,res) => {

    const {id_equipo} = req.params;
    try {
        const aplicaciones = await prisma.equipo_app.findMany({
           where:{
            id_equipo: parseInt(id_equipo)
           },
              include:{
                aplicacion:true
              }
        });
        return res.status(200).json(aplicaciones);
    } catch (error) {
        console.log(error)
    }
}

export const getAplicaciones = async(req,res) => {
    try {
        const aplicaciones = await prisma.aplicacion.findMany();
        return res.status(200).json(aplicaciones);
    } catch (error) {
        console.log(error)
    }
}