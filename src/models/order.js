const mongoose=require("mongoose");

const orderSchema=new mongoose.Schema({
     name:{type:String,required:true},
     customerId:{type:String,required:true},
     contact:{type:String,required:true},
     email:{type:String},
     address:{type:String,required:true},
     address2:{type:String},
     items:{type:Array,required:true},
     shipOrderId:{type:Number},
     shipmentId:{type:Number},
     status:{type:String,default:"ORDER"},
     pin:{type:String,required:true},
     state:{type:String,required:true},
     city:{type:String,required:true},
     sub_total:{type:Number},
     length:{type:Number},
     breadth:{type:Number},
     height:{type:Number},
     weight:{type:Number},
},{timestamps:true});

const order=new mongoose.model("order",orderSchema);

module.exports=order;