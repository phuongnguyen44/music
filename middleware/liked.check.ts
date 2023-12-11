import { Request, Response, NextFunction } from "express";
import Song from "../models/song.model";
import User from "../models/user.model";


export const Liked = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
        try {
            const slugSong=req.params.slugSong
            const token=req.cookies.tokenUser
            const user= await User.findOne({
                token:token,
                deleted:false
            })
            if(user){
                const song= await Song.findOne({
                    slug:slugSong,
                    deleted:false
                })
                let checked:boolean=false;
                if(song.like.includes(user.id)){
                    checked=true;
                }
                res.locals.checked=checked
            }
           
            next();
        } catch (error) {
            res.redirect("/topics")
        }
       
      
};