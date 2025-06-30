const mongoose=require("mongoose");

const brandCategorySchema= new mongoose.Schema({
    userId:{type:String,required:true},
    brandName:{type:String},
    categoryName:{type:String,required:true},
    categoryImage:{type:String,required:true},
    technicianCharges:{type:Number,default:0},
    status:{type:String,default:"INACTIVE"},
     
},{timestamps:true});

const BrandCategoryModel = new mongoose.model("ProductCategory",brandCategorySchema);

module.exports=BrandCategoryModel;