const mongoose=require("mongoose");

const returnOrderSchema=new mongoose.Schema({
     name:{type:String,required:true},
     customerId:{type:String,required:true},
     contact:{type:String,required:true},
     email:{type:String},
     address:{type:String,required:true},
     address2:{type:String},
     items:{type:Array,required:true},
     shipOrderId:{type:Number},
     shipmentId:{type:Number},
     orderId:{type:String},
     status:{type:String,default:"ORDER"},
     pin:{type:String,required:true},
     state:{type:String,required:true},
     city:{type:String,required:true}
},{timestamps:true});

const returnOrder=new mongoose.model("returnOrder",returnOrderSchema);

module.exports=returnOrder; 