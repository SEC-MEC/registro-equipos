import prisma from "../../orm/prisma.js";


export const findEquipoByNameRepository = async(EquipoName) => {

    try {

        const exist = await prisma.equipo.findFirst({data: EquipoName})

        return exist;

    } catch (error) {
        throw new Error("Error al buscar el equipo: " + error.message);  
    }
}



export const createEquipoRepository = async(EquipoData) => {

    try {
        const create = await prisma.equipo.create({data: EquipoData})
        return create;
    } catch (error) {
        throw new Error("Error al crear el equipo: " + error.message);
    }

}

