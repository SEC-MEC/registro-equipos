

import { Router } from "express";
import { createEquipo } from "../controllers/equipos/post/postEquipos.controller.js";
import { getEquipos } from "../controllers/equipos/get/getEquipos.controller.js";


const equipoRouter = Router();


equipoRouter.post("/create", createEquipo)
equipoRouter.get("/get", getEquipos)



export default equipoRouter;