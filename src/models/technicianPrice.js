const mongoose=require("mongoose");

const technicinaPriceSchema=new mongoose.Schema({
    categoryName:{type:String,required:true},
    categoryId:{type:String,required:true},
    technicianPrice:{type:Number,required:true}
},{timestamps:true});

const TechnicianPriceModel=new mongoose.model("technicianPrice",technicinaPriceSchema);

module.exports=TechnicianPriceModel;