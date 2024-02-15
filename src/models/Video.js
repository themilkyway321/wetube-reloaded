import mongoose from "mongoose";


const videoSchema = new mongoose.Schema({
    // title:String,
    title:{type:String, required:true},
    // description:String,
    description:{type:String, required:true},
    // createdAt:Date,
    createdAt:{type:Date, required:true, default:Date.now },
    hashtags:[{type:String}],
    meta:{
        views:{type:Number, default:0, required:true},
        rating:{type:Number, default:0, required:true},
    },
});


const Video = mongoose.model("Video", videoSchema);

export default Video;