import { Request,Response } from "express"
import FavoriteSong from "../../models/favorite-song.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import User from "../../models/user.model";
export const index = async(req: Request, res: Response) =>{
    const token = req.cookies.tokenUser
    const user= await User.findOne({
      token:token,
      deleted:false
    })
    if(user){
      const favoriteSongs = await FavoriteSong.find({
        userId: user.id,
        deleted: false
      });
    
      for(const item of favoriteSongs) {
        const infoSong = await Song.findOne({
          _id: item.songId
        });
    
        const infoSinger = await Singer.findOne({
          _id: infoSong.singerId
        });
    
        item["infoSong"] = infoSong;
        item["infoSinger"] = infoSinger;
      }
      res.render("client/pages/favorite-songs/index", {
        pageTitle: "Bài hát yêu thích",
        favoriteSongs:favoriteSongs
      });
    }
    else{
      res.redirect("/topics")
    }
    
    
}