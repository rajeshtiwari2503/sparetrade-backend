const mongoose=require("mongoose");

const verifySchema=new mongoose.Schema({
    orderId:{type:String,required:true},
    brandId:{type:String,required:true},
    video:{type:String,required:true},
    status:{type:String,default:"NOT_VERIFIED"},
},{timestamps:true});

const verifyModel=new mongoose.model("orderReturnVerify",verifySchema);

module.exports=verifyModel;