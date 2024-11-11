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