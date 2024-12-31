const mongosoe = require("mongoose");

const userSchema = new mongosoe.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true,
        min:12
    },
},{timestamps:true})

const UserModel = mongosoe.model('User',userSchema);
 
module.exports = UserModel;
