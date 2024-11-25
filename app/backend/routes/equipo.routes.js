

import { Router } from "express";
import { createEquipo, createName, generateEquipoName, getInfoEquipo } from "../controllers/equipos/post/postEquipos.controller.js";
import { getAplicaciones, getAplicacionesById, getEquipos, getOficinas } from "../controllers/equipos/get/getEquipos.controller.js";


const equipoRouter = Router();


equipoRouter.post("/create", createEquipo)
equipoRouter.get("/get", getEquipos)
equipoRouter.get("/oficinas", getOficinas)
equipoRouter.get("/aplicaciones/:id_equipo", getAplicacionesById)
equipoRouter.get("/aplicaciones", getAplicaciones)
equipoRouter.post("/pcInfo", getInfoEquipo)
equipoRouter.post("/generate-name", generateEquipoName);
equipoRouter.post("/create-name", createName);

export default equipoRouter;