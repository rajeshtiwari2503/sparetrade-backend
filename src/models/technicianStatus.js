const mongoose=require("mongoose");

const technicianSchema=new mongoose.Schema({
      orderId:{type:String,required:true},
      status:{type:String,required:true},
      closed:{type:Boolean,default:false}
},{timestamps:true});

const technician=new mongoose.model("technicianStatus",technicianSchema);

module.exports=technician;