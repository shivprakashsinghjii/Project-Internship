import mongoose from "mongoose";
const schema=mongoose.Schema;
const userSchema=new schema(
   {
    name:{
      type:String,
      required:true
   },
    email:{
      type:String,
      required:true,
      unique:true,
      index:true
    },
    password:{
      type:String,
      required:true
    }
   },{
      timestamps:true
   }
);
const User=mongoose.model("User",userSchema);
export default User;