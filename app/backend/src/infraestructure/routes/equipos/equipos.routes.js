import { Router } from "express";
import { createEquipoHandler, generateNameHandler } from "../../controllers/equipo.controller";



const equipoRouter = Router();




equipoRouter.post("/create", createEquipoHandler)
equipoRouter.post("/create-name", generateNameHandler);


export default equipoRouter;