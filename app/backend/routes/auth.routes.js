import { Router } from "express";
import { loginService ,authService } from "../controllers/users/auth.controller.js";
import { registerService, changePasswordService } from "../controllers/users/users.controller.js";


const authRouter = Router()



userRouter.post("/register", registerService)
userRouter.post("/login", loginService)

userRouter.get("/auth", authService)
userRouter.get("/user", getUsers)

userRouter.put("/changePassword/:id", changePasswordService)





export default authRouter;

