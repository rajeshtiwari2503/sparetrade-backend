const mongoose=require("mongoose");

const notificationSchema= new mongoose.Schema({
      id:{type:String},
      brandId:{type:String},
      category:{type:String},
      name:{type:String},
      title:{type:String},
},{timestamps:true});

const notificationModel = new mongoose.model("notification",notificationSchema);

module.exports=notificationModel;   