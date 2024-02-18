import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
    
    return res.render("join",{pageTitle:"Join"});

    }
export const postJoin = async(req, res)=>{
    const { name, username, email, password, password2, location } = req.body;

    if(password !== password2){
        return res.status(400).render("join",{pageTitle:"join",  errorMessage: "Password confirmation does not match.",});
    }
    const exists  = await User.exists({$or: [{username:username},{email:email}]});
    if(exists ){
        return res.status(400).render("join",{pageTitle:"join",  errorMessage: "Already taken Username or Eamil!!!",});
    }
    try{
        await User.create({
            name,
            username,
            email,
            password,
            location,
          });
    }catch(error){
        return res.status(400).render("join",{pageTitle:"Error join",  errorMessage: error._message,});
    }
  return res.redirect("/login");
};
export const getLogin = (req, res) => {
    
    return res.render("login",{pageTitle:"Login"});
}
export const postLogin = async(req, res) => {
    const {username, password} =req.body;
    const user = await User.findOne({username})
    if(!user){
        return res.status(400).render("login",{pageTitle:"Login", errorMessage:"An account with this username does not exists.",
    });
    }
    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        return res.status(400).render("login",{pageTitle:"Login", errorMessage:"Wrong password", }
        )}
    req.session.loggedIn =true;
    req.session.user = user;
    
    return res.redirect("/");
}
export const userEdit = (req, res) => res.send("Edit users");
export const remove = (req, res) => res.send("Remove users");
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("See User");