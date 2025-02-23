import prisma from "../../orm/prisma.js";


export const findEquipoByNameRepository = async(EquipoName) => {

    try {

        const exist = await prisma.equipo.findFirst({
            select: {nombre: true},
        })
        return exist;
    } catch (error) {
        throw new Error("Error al buscar el equipo: " + error.message);  
    }
}



export const createEquipoRepository = async(EquipoData) => {

    try {
        return await prisma.equipo.create({data: EquipoData})
    } catch (error) {
        throw new Error("Error al crear el equipo: " + error.message);
    }

}


export const createEquipoAppRepository = async (equipoId, aplicaciones) => {
    try {
        if (aplicaciones.length > 0) {
            await prisma.equipo_app.createMany({
                data: aplicaciones.map((idApp) => {
                    const parsedId = parseInt(idApp, 10);
                    if (isNaN(parsedId)) {
                        throw new Error(`El ID de la aplicación "${idApp}" no es un número válido.`);
                    }
                    return { id_equipo: equipoId, id_app: parsedId };
                }),
            });
        }
    } catch (error) {
        throw new Error("Error al asociar aplicaciones al equipo: " + error.message);
    }
};