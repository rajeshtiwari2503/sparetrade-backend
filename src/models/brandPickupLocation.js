const mongoose=require("mongoose");

const pickupLocationSchema=new mongoose.Schema({
        userId:{type:String,required:true},
        pickupLocation: {type:String,required:true},
        name: {type:String,required:true},
        email: {type:String,required:true},
        phone: {type:Number,required:true},
        address: {type:String,required:true},
        address2: {type:String},
        city: {type:String,required:true},
        state:{type:String,required:true},
        country: {type:String,default:"India"},
        pinCode: {type:Number,required:true}
        
    }
,{timestamps:true});

const pickupLocationModel=new mongoose.model("pickupLocation",pickupLocationSchema);

module.exports=pickupLocationModel;