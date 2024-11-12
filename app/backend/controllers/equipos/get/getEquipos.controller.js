import prisma from "../../../config/db.js";

  


  export const getEquipos = async (req, res) => {
    try {
        const equipos = await prisma.equipo.findMany({
            include:{
                modificado:true,
                oficina:true,
                equipo_usuario:true,
                equipo_app:true
            }
        })
        return res.status(200).json(equipos);
    } catch (error) {
        console.log("Error en getEquipos: ", error)
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
