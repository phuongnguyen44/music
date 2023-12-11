import { Request,Response } from "express"
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import User from "../../models/user.model";
import FavoriteSong from "../../models/favorite-song.model";
export const list = async (req: Request, res: Response) => {
    const topic = await Topic.findOne({
        slug: req.params.slugTopic,
        status: "active",
        deleted: false
    });
    const songs = await Song.find({
        topicId: topic.id,
        status: "active",
        deleted: false
    }).select("avatar title slug singerId like");
    for (const song of songs) {
        const infoSinger = await Singer.findOne({
            _id: song.singerId,
            status: "active",
            deleted: false
        });
        song["infoSinger"] = infoSinger;
    }
    res.render("client/pages/songs/list", {
        pageTitle: topic.title,
        songs: songs
    });
}
export const detail = async(req: Request, res: Response) =>{
    const slugSong: string = req.params.slugSong;
    const token = req.cookies.tokenUser
    const user= await User.findOne({
      token:token,
      deleted:false
    })
    const song = await Song.findOne({
        slug: slugSong,
        status: "active",
        deleted: false
    });
    const singer = await Singer.findOne({
        _id: song.singerId,
        deleted: false
    }).select("fullName");
    const topic = await Topic.findOne({
        _id: song.topicId,
        deleted: false
    }).select("title");
    if(user)
    {
      const favoriteSong = await FavoriteSong.findOne({
        userId:user.id,
        songId:song.id
  
      })
      song["isFavoriteSong"]=favoriteSong ? true : false
    }

    res.render("client/pages/songs/detail", {
        pageTitle: "Chi tiết bài hát",
        song: song,
        singer: singer,
        topic: topic
    });
    
}
export const like = async(req: Request, res: Response) =>{
  const idSong: string = req.params.idSong;
  const token = req.cookies.tokenUser
  if(!token){
    res.json({
      code: 400,
      message: "Khong co Token!"
    });
    return;
  }
  const user = await User.findOne({
    token:token,
    deleted: false
  })
  if(!user){
    res.json({
      code: 400,
      message: "Khong ton tai user!"
    });
    return;
  }
  
  const song = await Song.findOne({
    _id: idSong,
    status: "active",
    deleted: false
  });
  if(song.like.includes(user.id)){
    const newArr:string[] = song.like.filter(item => item !=user.id)
    await Song.updateOne({
      _id:song.id
    },{
      like:newArr
    })
  }
  else{
    const newArr:string[]= song.like
    newArr.push(user.id)
    await Song.updateOne({
      _id:song.id
    },{
      like:newArr
    })

  }
  const lastSong=await Song.findOne({
    _id: idSong,
    status: "active",
    deleted: false
  })
  res.json({
    code: 200,
    message: "Thành công!",
    like: lastSong.like.length
  });
}
export const favorite = async(req: Request, res: Response) =>{
  const idSong= req.params.idSong
  const token = req.cookies.tokenUser
  const user = await User.findOne({
    token:token,
    deleted:false
  })
  if(!user){
    res.json({
      code: 400,
      message: "De nghi dang ky de them vao bai hat yeu thich!"
    });
    return
  }
  const existFavoriteSong = await FavoriteSong.findOne({
    songId: idSong,
    userId:user.id
  });
  if(!existFavoriteSong){
    const record = new FavoriteSong({
      userId: user.id,
      songId: idSong
    });
    await record.save();
  }
  else{
    await FavoriteSong.deleteOne({
      songId: idSong,
      userId:user.id
    });
  }
  res.json({
    code: 200,
    message: "Thành công!"
  });
}
export const listen =async(req: Request, res: Response) =>{
  const idSong: string = req.params.idSong;
  const song = await Song.findOne({
    _id: idSong
  });

  const listen: number = song.listen + 1;

  await Song.updateOne({
    _id: idSong
  }, {
    listen: listen
  });

  const songNew = await Song.findOne({
    _id: idSong
  });

  res.json({
    code: 200,
    message: "Thành công!",
    listen: songNew.listen
  });
}