import mongoose from "mongoose";

// export const testFormatHashtag = (hashtags) =>hashtags.split(",")
//                                         .map((item)=>(item.startsWith("#")? `${item}`: `#${item}`));


const videoSchema = new mongoose.Schema({
    // title:String,
    title:{type:String, required:true, trim:true, maxLength:80},
    // description:String,
    description:{type:String, required:true, trim:true, minLength:20},
    fileUrl: { type: String, required: true },
    thumbUrl: { type: String, required: true },
    // createdAt:Date,
    createdAt:{type:Date, required:true, default:new Date },
    hashtags:[{type:String, trim:true}],
    meta:{
        views:{type:Number, default:0, required:true},
        rating:{type:Number, default:0, required:true},
    },
    comments: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
      ],
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

// videoSchema.static("formatDaysCount", function(createdAt){
//     var seconds = Math.floor((new Date() - createdAt) / 1000);
//     var divisors = [31536000, 2592000, 86400, 3600, 60, 1]
//     var description = ["years", "months", "days", "hours", "minutes", "seconds"]
//     var result = [];
  
//     var interval = seconds;
  
//     for (i = 0; i < divisors.length; i++) {
//       interval = Math.floor(seconds / divisors[i])
//       if (interval > 1) {
//         result.push(interval + " " + description[i])
//       }
//       seconds -= interval * divisors[i]
//     }
  
//     return result.join(" ")
// })

const Video = mongoose.model("Video", videoSchema);

export default Video;