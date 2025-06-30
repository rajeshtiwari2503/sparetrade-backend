const mongoose=require("mongoose");

const brandSchema= new mongoose.Schema({
    brandName:{type:String},
    email:{type:String},
    contact:{type:Number},
    password:{type:String},
    gstNo:{type:String},
    gstDocument:{type:String},
    address:{type:String},
    aboutUs:{type:String},
    brandLogo:{type:String},
    brandBanner:{type:String},
    otp:{type:String},
    totalPay:{type:Number,default:0},
    totalDue:{type:Number,default:0},
    revenue:{type:Number,default:0},
    wallet:{type:Number,default:0},
    status:{type:String,default:"ACTIVE"},
    approval:{type:String,default:"DISAPPROVED"},
    role:{type:String}
},{timestamps:true});

const BrandModel = new mongoose.model("brand",brandSchema);

module.exports=BrandModel;
