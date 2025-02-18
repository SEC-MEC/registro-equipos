import { Router } from "express";
import { authService, loginService } from "../../../../controllers/users/auth.controller.js";



const authRouter = Router()



authRouter.post('/login', loginService);
authRouter.get('/auth', authService);


export default authRouter;