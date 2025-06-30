const mongoose=require("mongoose");

const reviewSchema=new mongoose.Schema({
      customerId:{type:String,required:true},
      customerName:{type:String,required:true},
      customerImage:{type:String},
      productId:{type:String,required:true},
      productName:{type:String,required:true},
      review:{type:String,required:true},
},{timestamps:true});

const reviewModel=new mongoose.model("review",reviewSchema);

module.exports=reviewModel;

