

import { Router } from "express";
import { createEquipo } from "../controllers/equipos/post/postEquipos.controller.js";
import { getAplicaciones, getEquipos, getOficinas } from "../controllers/equipos/get/getEquipos.controller.js";


const equipoRouter = Router();


equipoRouter.post("/create", createEquipo)
equipoRouter.get("/get", getEquipos)
equipoRouter.get("/oficinas", getOficinas)
equipoRouter.get("/aplicaciones", getAplicaciones)

export default equipoRouter;