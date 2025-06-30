const mongoose=require("mongoose");

const bankDetailSchema= new mongoose.Schema({
    brandId:{type:String,required:true},
    bankName:{type:String,required:true},
    accountHolderName:{type:String,required:true},
    accountNumber:{type:String,required:true},
    IFSC:{type:String,required:true},
    commission:{type:Number},
},{timestamps:true});

const bankDetailModel = new mongoose.model("bankDetail",bankDetailSchema);

module.exports=bankDetailModel;  