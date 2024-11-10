

import { Router } from "express";
import { createEquipo } from "../controllers/equipos/post/postEquipos.controller.js";


const equipoRouter = Router();


equipoRouter.post("/create", createEquipo)




export default equipoRouter;