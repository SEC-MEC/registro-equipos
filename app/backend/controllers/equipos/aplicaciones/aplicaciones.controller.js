import prisma from "../../../config/db.js";




    export const updateApp = async (req, res) => {
        const {id} = req.params;
        const {id_app} = req.body;

        try {
            if (!Array.isArray(id_app)) {
                return res.status(400).json({ error: "El campo id_app debe ser un array" });
            }
    
            const createData = id_app.map((app) => ({
                id_equipo: parseInt(id),
                id_app: parseInt(app.id),
            }));
    
            await prisma.equipo_app.createMany({
                data: createData,
                skipDuplicates: true, 
            });
    
            return res.status(200).json({ message: "Aplicaciones agergadas correctamente!" });
        } catch (error) {
            console.log("Error en updateApp: ", error);
            return res.status(500).json({ error: "Error al actualizar las aplicaciones" });
        }
    }


    export const deleteAplicaciones = async (req, res) => {
        const {id, id_app} = req.params;

            try {
                const deleteApp  = await prisma.equipo_app.delete({
                    where: {
                        id_equipo_id_app:{
                            id_equipo: parseInt(id),
                            id_app: parseInt(id_app),
                        }
                        
                    },
                });
                return res.status(200).json({ message: "Aplicacion eliminada" });
            } catch (error) {
                
            }
    }


    