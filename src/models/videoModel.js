const mongoose=require("mongoose");

const videoUpload=new mongoose.Schema({
    brandId:{type:String,required:true},
    video:{type:String},
    videoUrl:{type:String},
    productModel:{type:String,required:true},
},{timestamps:true})

const videoModel=new mongoose.model("video",videoUpload);

module.exports=videoModel;