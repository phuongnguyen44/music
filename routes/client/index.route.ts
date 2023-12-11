import { Express } from "express";
import { topicRoutes } from "./topic.route";
import { songRoutes } from "./song.route";
import { usersRoutes } from "./user.route";
import { infoUser } from "../../middleware/user.middleware";
import { favoriteSongRoutes } from "./favorite-song.route";
import { searchRoutes } from "./search.route";
const clientRoutes =  (app:Express):void =>{
    app.use (`/topics`,infoUser,topicRoutes)
    app.use(`/songs`,infoUser,songRoutes)
    app.use(`/users`,usersRoutes)
    app.use(`/favorite-songs`, favoriteSongRoutes)
    app.use(`/search`, searchRoutes)
}
export default clientRoutes