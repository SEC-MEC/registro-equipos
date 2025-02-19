import { Router } from "express";
import { registerHandler, updatePasswordHandler } from "../../controllers/user.controller.js";



const userRouter = Router()


userRouter.post('/register', registerHandler);
userRouter.post('/changePassword/:id', updatePasswordHandler)

export default userRouter;

