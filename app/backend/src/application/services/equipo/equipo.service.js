import { createEquipoAppRepository, createEquipoRepository, findEquipoByNameRepository } from "../../../infraestructure/repository/equipos/prisma-equipo.repository";



export const generarNombreEquipoService = async () => {

    try {
        
        const equipos = await findEquipoByNameRepository();
        
        const numerosUsados = equipos
            .map(e => {
                const match = e.nombre.match(/\d+$/); 
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

        return { success: true, data: nuevoNombre };
    } catch (error) {
        return { success: false, message: error.message };
    }
};


export const createEquipoService = async (equipoData) => {

    try {   
        const nuevoEquipo = await createEquipoRepository({
            nombre: equipoData.nombre,
            nro_serie: equipoData.nro_serie,
            id_inventario: equipoData.id_inventario,
            tipo: equipoData.tipo,
            observaciones: equipoData.observaciones,
            dominio: equipoData.dominio,
            equipo_usuario: {
                create: {
                    usuario: {
                        create: {
                            nombre: equipoData.equipo_usuario,
                            apellido: equipoData.equipo_usuario,
                            usr: equipoData.equipo_usuario,
                            interno: null,
                        },
                    },
                },
            },
            modificado: {
                create: {
                    id_tecnico: equipoData.id_tecnico,
                    fecha: new Date(),
                },
            },
            oficina: {
                connect: { id: equipoData.id_oficina },
            },
        });
        await createEquipoAppRepository(nuevoEquipo.id, equipoData.aplicaciones);
        return { success: true, message: "Equipo creado con éxito", data: nuevoEquipo};
    } catch (error) {
        return { success: false, message: error.message };
    }


}
