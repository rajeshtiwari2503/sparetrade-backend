const mongoose=require("mongoose");

const technicianStatusSchema=new mongoose.Schema({
      orderId:{type:String,required:true},
      status:{type:Boolean,required:true}
},{timestamps:true});

const technician=new mongoose.model("technicianStatus",technicianSchema);

module.exports=technician;