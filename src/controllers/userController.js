import User from "../models/User";
import Video from "../models/Video";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

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
    const user = await User.findOne({username, socialOnly:false})
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

export const startGithubLogin = (req, res)=>{
 const baseUrl ="https://github.com/login/oauth/authorize";
 const config ={
    client_id:process.env.GH_CLIENT,
    allow_signup:false,
    scope:"read:user user:email",
 };
 const params = new URLSearchParams(config).toString();
 const finalUrl =`${baseUrl}?${params}`;
 return res.redirect(finalUrl);
}
export const finishGithubLogin = async(req, res)=>{
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
      };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const data = await fetch(finalUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });
      const json = await data.json();
      if("access_token" in json){
        const {access_token}= json;
        const apiUrl = "https://api.github.com";
        const userData = await (await fetch(`${apiUrl}/user`,{
            headers:{
                Authorization:`Bearer ${access_token}`,
            },
        })).json();
        console.log(userData);
        const emailData = await(await fetch(`${apiUrl}/user/emails`,{
            headers:{
                Authorization:`Bearer ${access_token}`,
            },
        })).json();
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true);
        if(!emailObj){
              // set notification
            return res.redirect("/login")}
        let user = await User.findOne({email: emailObj.email});
        if (!user) {
            user = await User.create({
                avataUrl:userData.avatar_url,
                name: userData.name,
                username: userData.login,
                email: emailObj.email,
                password: "",
                socialOnly: true,
                location: userData.location,
              });
          } 

            req.session.loggedIn = true;
            req.session.user = user;
            return res.redirect("/");
          
      }else {
        return res.redirect("/login")
      }
      console.log(json);
}
export const logout = (req, res)=>{
    req.session.destroy();
    return res.redirect("/");
}
export const getEdit = (req, res) => {
    
 return res.render("edit-profile", {pageTitle:"Edit Profile"})
};
export const postEdit = async(req, res) => {
    // const i = req.session.user._id;
    // const {name, email, username,location} = req.body;
    const{
        session:{
            user:{_id, avataUrl},
        },
       body: {name, email, username, location},
       file
    } = req;

    console.log("file:", file);     
    const emailAndUsernameExists = await User.exists({
        _id: { $ne: _id },
        $or: [{ email }, { username }],
      });
      if (emailAndUsernameExists) {
        return res.status(400).render("edit-profile", {
          pageTitle: "Edit Profile",
          errorMessage: "Exists Username/Email. Change Them.",
        });
      }

    const updateUser = await User.findByIdAndUpdate(
        _id,
        {
            avataUrl: file ? file.path : avataUrl,
          name,
          email,
          username,
          location,
        },
        { new: true }
      );
      
      req.session.user = updateUser;
    
   return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) =>{
    if (req.session.user.socialOnly === true) {
        return res.redirect("/");
      }
return res.render("users/change-password",{pageTitle:"Change Password"})
}
export const postChangePassword  = async(req, res) =>{
    const {
        session:{
            user:{_id},
        },
        body: { oldPassword, newPassword, newPasswordConfirmation },
    } =req
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, user.password);
    if(!ok){
        return res.status(400).render("users/change-password",{
            pageTitle:"Change password",
            errorMessage:"The current password is incorrect",
        });
    }
    if(newPassword !== newPasswordConfirmation){
        return res.status(400).render("users/change-password",{
            pageTitle:"Change password",
            errorMessage:"The password does not match the confirmation",
        });
    }

    user.password = newPassword;
    await user.save();

    return res.redirect("/")
}


export const see = async(req, res) =>{ 
    const {id} =req.params;
    const user = await User.findById(id).populate("videos");
    if (!user) {
        return res.status(404).render("404", { pageTitle: "User not found." });
      }
    console.log(user);
    // const videos = await Video.find({owner: user._id});
    return res.render("users/profile",{
        pageTitle:user.name,
        user,
    })};