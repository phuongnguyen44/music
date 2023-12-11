import { Router } from "express";
import * as controller from "../../controllers/client/users.controller"
const router:Router = Router()

router.get("/register",controller.register)
router.post("/register",controller.registerPost)
router.get("/login",controller.login)
router.post("/login",controller.loginPost)
export const usersRoutes:Router = router