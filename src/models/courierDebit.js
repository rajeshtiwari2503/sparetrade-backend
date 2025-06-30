const mongoose=require("mongoose");

const courierTransactionSchema=new mongoose.Schema({
    brandId:{type:String},
    brandName:{type:String},
    courier:{type:String},
    debitAmount:{type:Number},
},{timestamps:true})

const CourierModel=new mongoose.model("courierTransaction",courierTransactionSchema);

module.exports= CourierModel;