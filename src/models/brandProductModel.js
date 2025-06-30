const mongoose=require("mongoose");

const brandProductSchema= new mongoose.Schema({
    userId:{type:String,required:true},
    categoryId:{type:String,required:true},
    brandName:{type:String},
    productName:{type:String,required:true},
    productImage:{type:String,required:true},
    productCategory:{type:String,required:true},
    productDescription:{type:String}     
},{timestamps:true});

const BrandProductModel = new mongoose.model("BrandProduct",brandProductSchema);

module.exports=BrandProductModel;