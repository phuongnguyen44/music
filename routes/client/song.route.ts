import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/client/song.controller"
import { Liked } from "../../middleware/liked.check";
router.get("/:slugTopic",controller.list);
router.get("/detail/:slugSong",Liked,controller.detail)
router.patch("/like/:idSong", controller.like)
router.patch("/favorite/:idSong",controller.favorite)
router.patch("/listen/:idSong", controller.listen);
export const songRoutes: Router = router;