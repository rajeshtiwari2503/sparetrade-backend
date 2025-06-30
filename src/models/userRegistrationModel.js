const mongoose=require("mongoose");

const userSchema= new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    contact:{type:Number,required:true},
    role:{type:String,required:true},
    image:{type:String},
    document:{type:String},
    discount:{type:String,default:"NOT_VERIFIED"},
    discountPercentage:{type:Number,default:0},
    address:{type:String},
    address2:{type:String},
    pin:{type:String},
    city:{type:String},
    state:{type:String},
    otp:{type:String},
},{timestamps:true});

const UserModel = new mongoose.model("users",userSchema);

module.exports=UserModel;