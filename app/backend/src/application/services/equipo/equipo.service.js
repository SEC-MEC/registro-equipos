import { createEquipoRepository, findEquipoByNameRepository } from "../../../infraestructure/repository/equipos/prisma-equipo.repository";



export const generarNombreEquipo = async () => {

    try {
        
        const equipos = await prisma.equipo.findMany({
            select: {pcName: true},
        });

        
        const numerosUsados = equipos
            .map(e => {
                const match = e.pcName.match(/\d+$/); 
                return match ? parseInt(match[0], 10) : null;
            })
            .filter(num => num !== null) 
            .sort((a, b) => a - b); 

        
        let nuevoNumero = 1; 
        for (let i = 0; i < numerosUsados.length; i++) {
            if (numerosUsados[i] !== nuevoNumero) {
                break; 
            }
            nuevoNumero++;
        }

        const nuevoNumeroFormateado = String(nuevoNumero).padStart(3, "0");

        const nuevoNombre = nuevoNumeroFormateado;

        return nuevoNombre;
    } catch (error) {
        throw new Error("No se pudo generar el nombre del equipo");
    }
};


export const createEquipoService = async (equipoData) => {

    try {   
        const newEquipo = await createEquipoRepository(equipoData);
        return newEquipo;
    } catch (error) {
        throw new Error("No se pudo crear el equipo");
    }


}
