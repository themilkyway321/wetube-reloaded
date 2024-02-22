import mongoose from "mongoose";

// export const testFormatHashtag = (hashtags) =>hashtags.split(",")
//                                         .map((item)=>(item.startsWith("#")? `${item}`: `#${item}`));


const videoSchema = new mongoose.Schema({
    // title:String,
    title:{type:String, required:true, trim:true, maxLength:80},
    // description:String,
    description:{type:String, required:true, trim:true, minLength:20},
    fileUrl: { type: String, required: true },
    // createdAt:Date,
    createdAt:{type:Date, required:true, default:Date.now },
    hashtags:[{type:String, trim:true}],
    meta:{
        views:{type:Number, default:0, required:true},
        rating:{type:Number, default:0, required:true},
    },
    owner:{type:mongoose.Schema.Types.ObjectId, required:true, ref:"User"},
});


// videoSchema.pre("save", async function(){
//     this.hashtags = this.hashtags[0]
//                         .split(",")
//                         .map((item)=>(item.startsWith("#")? item: `#${item}`))
// })


videoSchema.static("formatHashtags", function(hashtags){
    return hashtags.split(",")
                    .map((item)=>(item.startsWith("#")? `${item}`: `#${item}`));
})

const Video = mongoose.model("Video", videoSchema);

export default Video;