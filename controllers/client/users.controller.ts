import { Request,Response } from "express"
import User from "../../models/user.model"
import md5 from "md5";
import { generateRandomString } from "../../helper/generate";
export const register = async(req:Request,res:Response) =>{
    res.render("client/pages/users/register",{
        pageTitle:"Register",
    })
}
export const registerPost = async(req:Request,res:Response) =>{
    const emailExist = await User.findOne({
        email: req.body.email,
        deleted: false,
      });
    if(emailExist){
        res.redirect("/topics")
    }
    else{
        req.body.password = md5(req.body.password);
        req.body.token = generateRandomString(30);

        const user = new User(req.body);
        const data = await user.save();
        const token =data.token
        res.cookie("tokenUser", token); 
        res.redirect("/topics")
        
    }
}
export const login =async(req:Request,res:Response) =>{
    res.render("client/pages/users/login",{
        pageTitle:"Login",
    })
}
export const loginPost= async(req:Request,res:Response) =>{
    const email: string = req.body.email;
    const password: string = req.body.password;
    const user = await User.findOne({
        email: email,
        deleted: false,
      });
    
      if (!user) {
        res.redirect("/topics")
        return;
    }
    if (md5(password) !== user.password) {
        res.redirect("/topics")
        return;
    }
    const token = user.token;
    res.cookie("tokenUser", token); 
    res.redirect("/topics")

}