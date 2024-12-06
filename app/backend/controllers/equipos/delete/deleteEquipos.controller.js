import prisma from "../../../config/db.js";



export const deleteEquipo = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await prisma.equipo.delete({
            where: { id: parseInt(id) },
        });
        return res.json({ success: "Equipo eliminado con éxito", result });
    } catch (error) {
        console.log(error);
    }
}