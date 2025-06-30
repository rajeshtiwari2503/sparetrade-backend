const mongoose=require("mongoose");

const walletTransactionSchema=new mongoose.Schema({
    brandId:{type:String},
    brandName:{type:String},
    addedAmount:{type:Number},
},{timestamps:true})

const WalletModel=new mongoose.model("walletTransaction",walletTransactionSchema);

module.exports=WalletModel;