import { Router } from "express";
import { loginService ,authService } from "../controllers/users/auth.controller.js";
import { registerService, changePasswordService, getUsers } from "../controllers/users/users.controller.js";


const authRouter = Router()



authRouter.post("/register", registerService)
authRouter.post("/login", loginService)

authRouter.get("/auth", authService)
authRouter.get("/user", getUsers)

authRouter.put("/changePassword/:id", changePasswordService)





export default authRouter;

