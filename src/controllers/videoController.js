import Video from "../models/Video";
import User from "../models/User";

export const home = async(req, res) => {
    const videos = await Video.find({}).sort({createdAt:"desc"});
  return res.render("home", {pageTitle: "Home", videos})
};

export const see = async(req, res)=>  {
  const {id} =req.params; //same req.params.id 
  const video = await Video.findById(id).populate("owner");
  // const videoOwner = await User.findById(video.owner);
  // console.log(video);
  if(!video){
    return res.status(404).render("404", {pageTitle:"Video not found."})
  }
    return res.render("watch", {pageTitle:video.title, video})
  };

export const getEdit = async(req, res) =>  {
    const {id} =req.params; 
    const {
      user:{_id}
    } =req.session;
    const video = await Video.findById(id);
    if(String(video.owner) !== String(_id)){
      return res.status(403).redirect("/");
    }
    if(!video){
      return res.render("404", {pageTitle:"Video not found."})
    }
    return res.render("edit", {pageTitle: `Edit:${video.title}`, video})
  };

export const postEdit = async(req, res) =>{ 
  const {id} =req.params;
  const {
    user:{_id}
  } =req.session;
  const {title, description, hashtags} =req.body; //form에서 name에 전송된 정보

const video = await Video.exists({_id:id});
if(String(video.owner) !== String(_id)){
  return res.status(403).redirect("/");
}
if(!video){
      return res.status(404).render("404", {pageTitle:"Video not found."})
    }
  //  const video = await Video.findById(id);
  //   if(!video){
  //     return res.render("404", {pageTitle:"Video not found."})
  //   }



  await Video.findByIdAndUpdate(id,{
    title:title, 
    description:description, 
    hashtags:Video.formatHashtags(hashtags),
  });


  //   video.title= title;
  //   video.description = description;
  //   video.hashtags = hashtags
  //   .split(",")
  //   .map((item)=>(item.startsWith("#")? `${item}`: `#${item}`));
  //   await video.save(); //수정된 정보 저장
  return res.redirect(`/videos/${id}`)
};


export const getUpload = (req, res) =>{   
  return res.render("upload",{pageTitle:"Upload Video"})};

export const postUpload = async (req, res) => {
  const {
    user:{_id}
  } = req.session;
    const { title, description, hashtags } = req.body;
    const {file} = req;
    console.log(req.file);
    try{
      const newVideo = await Video.create({
        title:title,
        fileUrl:file.path,
        owner:_id,
        description:description,
        hashtags:Video.formatHashtags(hashtags),
      });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/")
    } catch(error){
      return res.status(400).render("upload",{pageTitle:"Upload Video", errorMessage:error._message,})
    }
};

export const deleteVideo = async(req,res)=>{
 const {id} =req.params;
 const {user:{_id}} =req.session;

 const video = await Video.findById(id);
 if (!video) {
  return res.status(404).render("404", { pageTitle: "Video not found." });
}
if(String(video.owner) !== String(_id)){
  return res.status(403).redirect("/");
}

await Video.findByIdAndDelete(id);
  return res.redirect("/");
};


export const search = async (req, res)=>{
  const {keyword} = req.query;
  let videos = [];
  if(keyword){
    videos = await Video.find({
      title:{
        $regex: new RegExp(keyword,"i"),
      },
    })
  }

  return res.render("search", {pageTitle:"Search", videos})
}