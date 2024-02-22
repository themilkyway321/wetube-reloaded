import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    email:{type:String, required:true, unique:true},
    socialOnly: { type: Boolean, default: false },
    avataUrl:String,
    username:{type:String, required:true, unique:true},
    password:{type:String},
    name:{type:String, required:true},
    location:String,
    videos:[{type:mongoose.Schema.Types.ObjectId, ref:"Video"}],
});


UserSchema.pre("save", async function(){
    //패스워드가 변경될때만 hash해주기 
    if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 5);
    }
})

const User = mongoose.model("User", UserSchema);

export default User;





