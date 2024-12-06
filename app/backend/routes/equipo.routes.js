

import { Router } from "express";
import { createEquipo, createName, generateEquipoName, getInfoEquipo, updateEquipos } from "../controllers/equipos/post/postEquipos.controller.js";
import { getAplicaciones, getAplicacionesById, getEquipos, getOficinas } from "../controllers/equipos/get/getEquipos.controller.js";
import { deleteAplicaciones, updateApp } from "../controllers/equipos/aplicaciones/aplicaciones.controller.js";
import { deleteEquipo } from "../controllers/equipos/delete/deleteEquipos.controller.js";


const equipoRouter = Router();


equipoRouter.post("/create", createEquipo)
equipoRouter.get("/get", getEquipos)
equipoRouter.get("/oficinas", getOficinas)
equipoRouter.get("/aplicaciones/:id_equipo", getAplicacionesById)
equipoRouter.get("/aplicaciones", getAplicaciones)
equipoRouter.post("/pcInfo", getInfoEquipo)
equipoRouter.post("/generate-name", generateEquipoName);
equipoRouter.post("/create-name", createName);

equipoRouter.put("/update/:id", updateEquipos)
equipoRouter.put("/update-app/:id", updateApp)
equipoRouter.delete("/delete-app/:id/:id_app", deleteAplicaciones)
equipoRouter.delete("/delete/:id", deleteEquipo)

export default equipoRouter;