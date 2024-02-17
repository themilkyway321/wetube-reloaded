import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    email:{type:String, required:true, unique:true},
    username:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    name:{type:String, required:true},
    location:String,
});


UserSchema.pre("save", async function(){
    this.password = await bcrypt.hash(this.password, 5);
    console.log(this.password);
})

const User = mongoose.model("User", UserSchema);

export default User;




